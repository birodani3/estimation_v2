const resultsPath = "/results/:channel"

/*@ngInject*/
export default class MainController {
    constructor($rootScope, $location, socket) {
        this.$rootScope = $rootScope;
        this.$location = $location;
        this.socket = socket;

        $rootScope.$on("$routeChangeSuccess", (event, current, prev = {}) => {
            if (this.hasChannel() && prev.originalPath === resultsPath) {
                this.$rootScope.channel = null;
                socket.emit("DELETE_CHANNEL");
            }
        });
    }

    getUserName() {
        return this.$rootScope.username;
    }

    getChannelName() {
        return this.$rootScope.channel;
    }

    hasChannel() {
        return !!this.getChannelName();
    }

    leaveChannel() {
        this.$location.path("/");
    }
}
