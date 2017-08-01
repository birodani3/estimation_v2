import * as io from 'socket.io-client';
import { noop } from 'lodash';

import { IEstimationRootScope } from 'app/models'; 
import { IToastService } from './toast.service';

export interface ISocketService {
    on: (event: string, scope: ng.IScope, callback: Function) => void;
    off: (event: string, listener: Function) => void;
    emit: (event: string, data?: any, callback?: Function) => void;
}

/* @ngInject */
export class SocketService implements ISocketService {
    isOnline: boolean;
    socket: SocketIOClient.Socket;

    constructor(private $rootScope: IEstimationRootScope, private toast: IToastService) {
        this.socket = io.connect();

        this.socket.on('connect', () => {
            this.setIsOnline(true);
        });

        this.socket.on('disconnect', () => {
            this.setIsOnline(false);
        });

        this.socket.on('reconnect_attempt', () => {
            if (this.isOnline !== false) {
                this.setIsOnline(false);
            }
        });
    }

    on(event: string, scope: ng.IScope, callback: Function): void {
        const listener: Function = (...args) => this.$rootScope.$evalAsync(() => callback.apply(this.socket, args));
        this.socket.on(event, listener);

        scope.$on('$destroy', () => {
            this.off(event, listener);
        });
    }

    off(event: string, listener: Function): void {
        this.socket.removeListener(event, listener);
        listener = undefined;
    }

    emit(event: string, data: any, callback = noop): void {
        if (!this.isOnline) {
            return;
        }

        this.socket.emit(event, data, (...args) => {
            this.$rootScope.$evalAsync(() => {
                callback.apply(this.socket, args);
            });
        });
    }

    private setIsOnline(isOnline: boolean): void {
        this.isOnline = isOnline;

        if (this.isOnline) {
            this.toast.success('Connected to the server', 1500);
        } else {
            this.toast.error('You are currenlty offline. ', 0);
        }
    }
}
