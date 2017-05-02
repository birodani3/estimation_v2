const Q          = require('q');
const path       = require('path');
const _          = require("lodash");
const JiraClient = require('jira-connector');
const bodyParser = require('body-parser');
const express    = require('express');
const app        = express();
const server     = require("http").createServer(app);
const io         = require("socket.io")(server);

const port = process.env.PORT || 3008;

app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use("*/dist", express.static(__dirname + '/dist'));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

let Jira;

app.post("/jira", (req, res) => {
    if (!req.body.username || !req.body.password || !req.body.sprintId) {
        res.send();
        return;
    }

    Jira = new JiraClient({
        host: 'jira.cas.de',
        basic_auth: {
            username: req.body.username,
            password: req.body.password
        }
    });

    Jira.sprint.getSprintIssues({ "sprintId": req.body.sprintId, "maxResults": 99 }, (err, issues) => {
        sendResponse(res, issues);
    });
});

app.post("/jira/setStoryPoints", (req, res) => {
    if (!req.body.tickets) {
        res.send();
        return;
    }

    if (Jira) {
        let promises = req.body.tickets.map((ticket) => {
            return Jira.issue.setIssueEstimation({ issueId: ticket.issueId, value: ticket.storyPoint, boardId: ticket.boardId });
        });

        Q.all(promises)
            .then(() => {
                sendResponse(res, "SUCCESS");
            })
            .catch(() => {
                sendResponse(res, "ERROR");
            });
    } else {
        console.log("JIRA not inited yet");
    }
});


/* [{
 *     name: string,
 *     settings: Object
 *     host: socket
 * }]
 */
let channels = [];

io.on('connection', (socket) => {
    // String
    let channel = null;

    socket.on('CREATE_CHANNEL', (payload, callback) => {
        let name = payload.name;

        if (!findChannelByName(name)) {
            channel = name;
            createChannel(socket, payload);

            callback({});
        } else {
            callback({ error: "NAME_ALREADY_EXISTS" });
        }
    });

    socket.on("JOIN_CHANNEL", (data, callback) => {
        console.log("join channel to: ", data.channel);

        let channelToJoin = findChannelByName(data.channel);

        if (channelToJoin) {
            // TODO check password
            channel = channelToJoin.name;
            joinChannel(socket, data);

            callback({
                //settings: channelToJoin.settings
                values: channelToJoin.values
            });
        } else {
            callback({ error: "CHANNEL_NOT_FOUND" });
        }
    });

    socket.on("LEAVE_CHANNEL", (data, callback) => {
        leaveChannel(socket, channel);

        channel = null;
    });

    socket.on("VOTE", (data, callback) => {
        let payload = {
            value: data.value,
            id: socket.id
        };

        emit.toChannelHost(channel, "USER_VOTED", payload);
    });

    socket.on("GET_CHANNELS", (data, callback) => {
        let channelList = getChannelListForSending();

        callback(channelList);
    });

    socket.on("DELETE_CHANNEL", () => {
        console.log("delete channel: ", channel);
        deleteChannel(socket, channel);
    });

    socket.on("REMOVE_USER", (card) => {
        emit.toSocket(card.id, "REMOVE_USER");
    });

    socket.on("RESET", () => {
        emit.toChannel(channel, "RESET");
    });

    socket.on("disconnect", () => {
        console.log("disconnect, channel was: ", channel);
        leaveChannel(socket, channel);

        channel = null;
    });
});

function findChannelByName(name) {
    return _.find(channels, { name });
}

function createChannel(socket, channel) {
    channels.push({
        name: channel.name,
        values: channel.values,
        host: socket
    });

    socket.join(channel);
    sendChannelList();
}

function joinChannel(socket, data) {
    socket.join(data.channel);

    emit.toChannelHost(data.channel, "USER_JOINED", { name: data.username, id: socket.id });
}

function deleteChannel(socket, channel) {
    emit.toChannel(channel, "CHANNEL_DELETED");
    socket.leave(channel);

    removeChannel(channel);
    sendChannelList();
}

function leaveChannel(socket, channel) {
    if (!channel) return;

    if (isChannelHost(socket)) {
        deleteChannel(socket, channel);
    } else {
        emit.toChannelHost(channel, "USER_LEFT", { id: socket.id });
    }

    socket.leave(channel);
}

function removeChannel(name) {
    _.remove(channels, (channel) => channel.name === name);
}

function sendChannelList() {
    let channelList = getChannelListForSending();

    emit.toAll("CHANNEL_LIST", channelList);
}

function getChannelListForSending() {
    return _.map(channels, (channel) => _.omit(channel, "host"));
}

function isChannelHost(socket) {
    return channels.some(channel => channel.host === socket);
}

/////////////////////////////////////// Socket emit helpers ///////////////////////////////////////

const emit = {
    toAll: (event, data) => {
        io.emit(event, data);
    },

    toChannel: (channelName, event, data) => {
        io.to(channelName).emit(event, data);
    },

    toSocket: (socketId, event, data) => {
        io.to(socketId).emit(event, data);
    },

    toChannelHost: (channelName, event, data) => {
        let channel = findChannelByName(channelName);

        if (channel) {
            let hostSocket = io.sockets.connected[channel.host.id];
            hostSocket.emit(event, data);
        }
    }
};

/////////////////////////////////////// Http helpers ///////////////////////////////////////

function sendResponse(res, data) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data));
}

///////////////////////////////////////////////////////////////////////////////////////////////////

// Start server
server.listen(port, (err) => {
    if (err) {
        return console.error(err);
    }

    console.log("Listening at http://localhost:" + port + "/");
});