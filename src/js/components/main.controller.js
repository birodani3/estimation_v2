const resultsPath = "/results/:channel"

/*@ngInject*/
export default class MainController {
    constructor($rootScope, $scope, $location, socket, dragulaBagId) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$location = $location;
        this.socket = socket;
        this.dragula = dragulaBagId;

        $rootScope.$on("$routeChangeSuccess", (event, current, prev = {}) => {
            if (prev.originalPath === resultsPath) {
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
        this.$rootScope.channel = null;
        this.$location.path("/");
    }
}
