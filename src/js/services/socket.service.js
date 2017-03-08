import io from "socket.io-client";
import _ from "lodash";

/*@ngInject*/
export default class SocketService {
    constructor($rootScope) {
        this.$rootScope = $rootScope;
        this.socket = io.connect();

        this.socket.on("connect", () => {
            console.log("socket connected");
        });
    }

    on(event, scope, callback) {
        let listener = (...args) => this.$rootScope.$evalAsync(() => callback.apply(this.socket, args));
        this.socket.on(event, listener);

        scope.$on("$destroy", () => {
            this.off(event, listener);
        });
    }

    off(event, listener) {
        this.socket.removeListener(event, listener);
        listener = undefined;
    }

    emit(event, data, callback = _.noop) {
        this.socket.emit(event, data, (...args) => {
            this.$rootScope.$evalAsync(() => {
                callback.apply(this.socket, args);
            });
        });
    }
}
