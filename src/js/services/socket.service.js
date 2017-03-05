import io from 'socket.io-client';

/*@ngInject*/
export default class SocketService {
    constructor($rootScope) {
        this.$rootScope = $rootScope;
        this.socket = io.connect();

        this.socket.on("connect", () => {
            console.log("socket connected");
        });
    }

    on(event, callback) {
        this.socket.on(event, (...args) => {
            this.$rootScope.$apply(() => callback.apply(this.socket, args));
        });
    }

    off(event, callback) {
        this.socket.removeListener(event, callback);
    }

    emit(event, data, callback) {
        this.socket.emit(event, data, (...args) => {
            this.$rootScope.$apply(() => {
                callback && callback.apply(this.socket, args);
            });
        });
    }
}
