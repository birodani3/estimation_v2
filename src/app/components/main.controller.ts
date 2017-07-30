import { ISocketService } from 'app/services'; 

const resultsPath = '/results/:channel'

/* @ngInject */
export class MainController {
    constructor(
        private $rootScope: ng.IRootScopeService,
        private $scope: ng.IScope,
        private $location: ng.ILocationService,
        private socket: ISocketService
    ) {
        $rootScope.$on('$routeChangeSuccess', (event, current, prev: any = {}) => {
            if (prev.originalPath === resultsPath) {
                socket.emit('DELETE_CHANNEL');
            }
        });
    }

    getUserName(): string {
        return this.$rootScope.username;
    }

    getChannelName(): string {
        return this.$rootScope.channel;
    }

    hasChannel(): boolean {
        return !!this.getChannelName();
    }

    leaveChannel(): void {
        this.$rootScope.channel = null;
        this.$location.path('/');
    }
}
