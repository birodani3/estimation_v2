const _ = require('lodash');

module.exports = (io) => {
    const emit = require('./emit')(io);

    /* [{
    *     name: string;
    *     settings: Object;
    *     host: socket;
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
                callback({ error: 'NAME_ALREADY_EXISTS' });
            }
        });

        socket.on('JOIN_CHANNEL', (data, callback) => {
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
                callback({ error: 'CHANNEL_NOT_FOUND' });
            }
        });

        socket.on('LEAVE_CHANNEL', (data, callback) => {
            leaveChannel(socket, channel);

            channel = null;
        });

        socket.on('VOTE', (data, callback) => {
            let payload = {
                value: data.value,
                id: socket.id
            };

            emitToChannelHost(channel, 'USER_VOTED', payload);
        });

        socket.on('GET_CHANNELS', (data, callback) => {
            let channelList = getChannelListForSending();

            callback(channelList);
        });

        socket.on('DELETE_CHANNEL', () => {
            deleteChannel(socket, channel);
        });

        socket.on('REMOVE_USER', (card) => {
            emit.toSocket(card.id, 'REMOVE_USER');
        });

        socket.on('RESET', () => {
            emit.toChannel(channel, 'RESET');
        });

        socket.on('disconnect', () => {
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

        emitToChannelHost(data.channel, 'USER_JOINED', { name: data.username, id: socket.id });
    }

    function deleteChannel(socket, channel) {
        emit.toChannel(channel, 'CHANNEL_DELETED');
        socket.leave(channel);

        removeChannel(channel);
        sendChannelList();
    }

    function leaveChannel(socket, channel) {
        if (!channel) return;

        if (isChannelHost(socket)) {
            deleteChannel(socket, channel);
        } else {
            emitToChannelHost(channel, 'USER_LEFT', { id: socket.id });
        }

        socket.leave(channel);
    }

    function removeChannel(name) {
        _.remove(channels, (channel) => channel.name === name);
    }

    function sendChannelList() {
        let channelList = getChannelListForSending();

        emit.toAll('CHANNEL_LIST', channelList);
    }

    function getChannelListForSending() {
        return _.map(channels, (channel) => _.omit(channel, 'host'));
    }

    function emitToChannelHost(channelName, event, data) {
        const hostChannel = _.find(channels, (channel) => channel.name === channelName);

        if (hostChannel) {
            emit.toChannel(hostChannel, event, data);
        }
    }

    function isChannelHost(socket) {
        return channels.some(channel => channel.host === socket);
    }
}