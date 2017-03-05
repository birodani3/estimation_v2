/*@ngInject*/
export default class MainController {
    constructor($rootScope, $location) {
        this.$rootScope = $rootScope;
        this.$location = $location;
    }

    getUserName() {
        return this.$rootScope.user;
    }

    getChannelName() {
        return this.$rootScope.channel;
    }

    hasChannel() {
        return !!this.getChannelName();
    }

    leaveChannel() {
        this.$rootScope.channel = null;
        this.$location.path("/");
    }
}
