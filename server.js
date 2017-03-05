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

let channels = [];

// User connected
io.on('connection', (socket) => {
    let channel = null;

    socket.on('CREATE_CHANNEL', (name, callback) => {
        // Not exists yet
        if (!findChannelByName(name)) {
            channel = name;
            createChannel(socket, name);

            callback({});
        } else {
            callback({ error: "NAME_ALREADY_EXISTS" });
        }
    });

    socket.on("JOIN_CHANNEL", (name, callback) => {
        console.log("join to: ", name);
        console.log("letezo channelek: ", channels);
        if (findChannelByName(name)) {
            channel = name;
            joinChannel(socket, name);

            callback({});
        } else {
            callback({ error: "CHANNEL_NOT_FOUND" });
        }
    });

    socket.on("GET_CHANNELS", (data, callback) => {
        callback(channels);
    });

    socket.on("DELETE_CHANNEL", () => {
        leaveChannel(socket, channel);
    });

    socket.on("disconnect", () => {
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
        hasPassword: false
    });

    socket.join(channel);
    io.emit("CHANNEL_LIST", channels);
}

function joinChannel(socket, channel) {
    socket.join(channel);
    socket.in(channel).emit("USER_JOINED", "kecske");
}

function leaveChannel(socket, channel) {
    socket.leave(channel);
    socket.in(channel).emit("CHANNEL_DELETED");

    _.pull(channels, channel);
    io.emit("CHANNEL_LIST", channels);
}

// Start server
server.listen(port, (err) => {
    if (err) {
        return console.error(err);
    }

    console.log("Listening at http://localhost:" + port + "/");
});