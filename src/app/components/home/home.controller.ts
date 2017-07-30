import { ISocketService } from '../../services';

/* @ngInject */
export class HomeController {
    constructor(private $location: ng.ILocationService, private socket: ISocketService) { }

    createChannel(): void {
        this.$location.path('/create');
    }

    joinChannel(): void {
        this.$location.path('/join');
    }
}
