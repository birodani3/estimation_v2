const _ = require('lodash');

module.exports = (io) => {
    const emit = require('./emit')(io);

    /* [{
    *     name: string;
    *     password?: string;
    *     settings: Object;
    *     host: socket;
    * }]
    */
    const channels = [];

    io.sockets.on('connection', (socket) => {
        // String
        let channel = null;

        socket.on('CREATE_CHANNEL', (payload, callback) => {
            const name = payload.name;

            if (!findChannelByName(name)) {
                channel = name;
                createChannel(socket, payload);

                callback({});
            } else {
                callback({ error: 'NAME_ALREADY_EXISTS' });
            }
        });

        socket.on('JOIN_CHANNEL', (data, callback) => {
            const channelToJoin = findChannelByName(data.channel);

            if (channelToJoin) {
                if (!channelToJoin.password || channelToJoin.password === data.password) {
                    channel = channelToJoin.name;
                    joinChannel(socket, data);
    
                    callback({
                        //settings: channelToJoin.settings
                        values: channelToJoin.values
                    });
                } else {
                    callback({error: 'WRONG_PASSWORD'});
                }
            } else {
                callback({ error: 'CHANNEL_NOT_FOUND' });
            }
        });

        socket.on('LEAVE_CHANNEL', (data, callback) => {
            leaveChannel(socket, channel);

            channel = null;
        });

        socket.on('VOTE', (data, callback) => {
            const payload = {
                value: data.value,
                id: socket.id
            };

            emitToChannelHost(channel, 'USER_VOTED', payload);
            callback && callback();
        });

        socket.on('GET_CHANNELS', (data, callback) => {
            const channelList = getChannelListForSending();

            callback && callback(channelList);
        });

        socket.on('DELETE_CHANNEL', () => {
            deleteChannel(socket, channel);
        });

        socket.on('REMOVE_USER', (card, callback) => {
            emit.toSocket(card.id, 'REMOVE_USER');
            callback && callback();
        });

        socket.on('RESET', (data, callback) => {
            emit.toChannel(channel, 'RESET');
            callback && callback();
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
            password: channel.password,
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
        const channelList = getChannelListForSending();

        emit.toAll('CHANNEL_LIST', channelList);
    }

    function getChannelListForSending() {
        return _.map(channels, (channel) => _.omit(channel, 'host'));
    }

    function emitToChannelHost(channelName, event, data) {
        const channel = _.find(channels, (channel) => channel.name === channelName);
        const channelHost = channel && channel.host;

        if (channelHost) {
            emit.toSocket(channelHost.id, event, data);
        }
    }

    function isChannelHost(socket) {
        return channels.some(channel => channel.host === socket);
    }
}