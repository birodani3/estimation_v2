/*@ngInject*/
export default class HomeController {
    constructor($location, socket) {
        this.$location = $location;
        this.socket = socket;
    }

    createChannel() {
        this.$location.path("/create");
    }

    joinChannel() {
        this.$location.path("/join");
    }
}
