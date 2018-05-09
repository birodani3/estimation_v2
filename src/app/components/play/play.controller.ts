import { IEstimationRootScope } from 'app/models/rootscope.model';
import { IToastService, ISocketService } from '../../services';

const MAX_REJOIN_ATTEMPTS = 3;

/* @ngInject */
export class PlayController {
    public isLoading: boolean;
    public values: (string | number)[];
    private settings: any;
    private username: string;

    constructor(
        private $rootScope: IEstimationRootScope,
        private $scope,
        private $route: ng.route.IRouteService,
        private $timeout: ng.ITimeoutService,
        private $cookies: ng.cookies.ICookiesService,
        private $location: ng.ILocationService,
        private $mdDialog: ng.material.IDialogService,
        private toast: IToastService,
        private socket: ISocketService
    ) {
        this.settings = {};
    
        $scope.$on('$destroy', () => {
            this.socket.emit('LEAVE_CHANNEL');
        });

        if (!$rootScope.username) {
            this.openUsernameDialog()
                .then(([username, password]) => {
                    this.initSocket();
                    this.joinChannel(username, password);
                })
                .catch(() => $location.path('/join'));
        } else {
            this.initSocket();
            this.joinChannel($rootScope.username, $rootScope.password);
        }
    }

    initSocket(): void {
        this.socket.on('CHANNEL_DELETED', this.$scope, this.onChannelDeleted.bind(this));
        this.socket.on('REMOVE_USER', this.$scope, this.onUserRemoved.bind(this));
        this.socket.on('RESET', this.$scope, this.onReset.bind(this));
        this.socket.on('connect', this.$scope, this.onClientReconnected.bind(this));
    }

    joinChannel(username: string, password: string): void {
        const channel = this.$route.current.params.channel;

        this.isLoading = true;
        this.username = username;

        this.socket.emit('JOIN_CHANNEL', { channel, password, username }, (data) => {
            this.isLoading = false;

            if (!data.error) {
                this.values = data.values;
                this.$rootScope.channel = channel;
                this.$rootScope.username = username;
                this.$cookies.put('username', username);
            } else {
                if (data.error = 'WRONG_PASWORD') {
                    this.toast.error('Incorrect password');
                }

                this.$location.path('/join');
            }
        });
    }

    openUsernameDialog(): ng.IPromise<[string, string]> {
        let confirmDialog = this.$mdDialog.prompt()
            .title('Type in your username')
            .placeholder('Username')
            .initialValue(this.$cookies.get('username') || '')
            .ok('Ok')
            .cancel('Cancel');

        return this.$mdDialog
            .show(confirmDialog)
            .finally(() => confirmDialog = undefined);
    }

    vote(value: string | number): void {
        let payload = {
            value,
            name: this.username
        };

        this.socket.emit('VOTE', payload, () => {
            this.isLoading = true;
        });
    }

    onChannelDeleted(): void {
        this.toast.warning('Channel deleted');
        this.back();
    }

    onUserRemoved(): void {
        this.toast.warning('You got removed from the channel');
        this.back();
    }

    onClientReconnected(): void {
        this.rejoinChannel(1);
    }

    rejoinChannel(attempt: number): void {
        const username = this.$rootScope.username;
        const channel = this.$route.current.params.channel;

        if (attempt > MAX_REJOIN_ATTEMPTS) {
            this.toast.error(`Could not rejoin to channel ${channel} after ${attempt} attempts, exiting.`);
            this.$location.path('/join');
            return;
        }

        this.isLoading = true;

        this.socket.emit('JOIN_CHANNEL', { channel, username }, (data) => {
            if (!data.error) {
                this.isLoading = false;
                this.toast.success(`Successfully rejoined to channel  ${channel}`);
            } else {
                this.toast.error(`Could not rejoin to channel ${channel}, retrying after 1sec`);

                this.$timeout(() => {
                    this.rejoinChannel(++attempt);
                }, 1000);
            }
        });
    }

    back(): void {
        this.$rootScope.username = null;
        this.$rootScope.channel = null;
        this.$location.path('/');
    }

    onReset(): void {
        this.isLoading = false;
    }
}
