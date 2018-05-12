import { ISocketService, IToastService } from '../../services';
import { IEstimationRootScope, Channel } from '../../models';

/* @ngInject */
export class JoinController {
    public channels: Channel[];
    public username: string;

    constructor(
        private $rootScope: IEstimationRootScope,
        private $scope,
        private $location: ng.ILocationService,
        private $cookies: ng.cookies.ICookiesService,
        private socket: ISocketService,
        private toast: IToastService
    ) {
        this.channels = [];
        this.username = $cookies.get('username') || '';

        this.initSocket();
    }

    initSocket(): void {
        this.socket.emit('GET_CHANNELS', null, this.onChannelListChanged.bind(this));
        this.socket.on('CHANNEL_LIST', this.$scope, this.onChannelListChanged.bind(this));
    }

    joinChannel(username: string, channel: string): void {
        username = username.trim();

        if (!username) {
            this.toast.warning('Username can not be empty!');
            return;
        }

        this.$rootScope.username = username;
        this.$location.path(`/play/${channel}`);
    }

    back(): void {
        this.$location.path('/');
    }

    onChannelListChanged(channels: Channel[]): void {
        this.channels = channels;
    }
}