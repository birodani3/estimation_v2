module.exports = (io) => {
    return {
        toAll: (event, data) => {
            io.emit(event, data);
        },

        toChannel: (channelName, event, data) => {
            io.to(channelName).emit(event, data);
        },

        toSocket: (socketId, event, data) => {
            io.to(socketId).emit(event, data);
        }
    };
}