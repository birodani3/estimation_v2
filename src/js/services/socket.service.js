import io from 'socket.io-client';
import _ from 'lodash';

/*@ngInject*/
export default class SocketService {
    constructor($rootScope, toast) {
        this.$rootScope = $rootScope;
        this.toast = toast;
        this.isOnline;

        this.socket = io.connect();

        this.socket.on('connect', () => {
            setIsOnline(true);
        });

        this.socket.on('disconnect', () => {
            setIsOnline(false);
        });

        this.socket.on('reconnect_attempt', () => {
            if (this.isOnline !== false) {
                setIsOnline(false);
            }
        });

        const setIsOnline = (isOnline) => {
            this.isOnline = isOnline;

            if (this.isOnline) {
                this.toast.success('Connected to the server', 1500);
            } else {
                this.toast.error('You are currenlty offline. ', 0);
            }
        }
    }

    on(event, scope, callback) {
        const listener = (...args) => this.$rootScope.$evalAsync(() => callback.apply(this.socket, args));
        this.socket.on(event, listener);

        scope.$on('$destroy', () => {
            this.off(event, listener);
        });
    }

    off(event, listener) {
        this.socket.removeListener(event, listener);
        listener = undefined;
    }

    emit(event, data, callback = _.noop) {
        if (!this.isOnline) {
            return;
        }

        this.socket.emit(event, data, (...args) => {
            this.$rootScope.$evalAsync(() => {
                callback.apply(this.socket, args);
            });
        });
    }
}
