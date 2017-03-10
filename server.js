const path    = require('path');
const express = require('express');
const _       = require("lodash");
const app     = express();
const server  = require("http").createServer(app);
const io      = require("socket.io")(server);

const port = 3008;

app.use(express.static(__dirname));
app.use("*/dist", express.static(__dirname + '/dist'));
app.use('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

/* [{
 *     name: string,
 *     hasPassword: boolean,
 *     host: socket
 * }]
 */
let channels = [];

io.on('connection', (socket) => {
    // String
    let channel = null;

    socket.on('CREATE_CHANNEL', (name, callback) => {
        console.log("create channel: ", name);

        if (!findChannelByName(name)) {
            channel = name;
            createChannel(socket, name);

            callback({});
        } else {
            callback({ error: "NAME_ALREADY_EXISTS" });
        }
    });

    socket.on("JOIN_CHANNEL", (data, callback) => {
        console.log("join channel to: ", data.channel);
        if (findChannelByName(data.channel)) {
            channel = data.channel;
            joinChannel(socket, data);

            callback({});
        } else {
            callback({ error: "CHANNEL_NOT_FOUND" });
        }
    });

    socket.on("GET_CHANNELS", (data, callback) => {
        let channelList = getChannelListForSending();

        callback(channelList);
    });

    socket.on("DELETE_CHANNEL", () => {
        console.log("delete channel: ", channel);
        deleteChannel(socket, channel);
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
        name: channel,
        hasPassword: false,
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

    toChannelHost: (channelName, event, data) => {
        let channel = findChannelByName(channelName);

        if (channel) {
            let hostSocket = io.sockets.connected[channel.host.id];
            hostSocket.emit(event, data);
        }
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////

// Start server
server.listen(port, (err) => {
    if (err) {
        return console.error(err);
    }

    console.log("Listening at http://localhost:" + port + "/");
});