/*@ngInject*/
export default class JoinController {
    constructor($scope, $rootScope, $location, $cookies, socket, toast) {
        this.$scope = $scope
        this.$rootScope = $rootScope;
        this.$location = $location;
        this.socket = socket;
        this.toast = toast;
        
        this.channels = [];
        this.username = $cookies.get("username") || "";

        this.initSocket();
    }

    initSocket() {
        this.socket.emit("GET_CHANNELS", null, this.onChannelListChanged.bind(this));
        this.socket.on("CHANNEL_LIST", this.$scope, this.onChannelListChanged.bind(this));
    }

    joinChannel(username, channel) {
        username = username.trim();

        if (!username) {
            this.toast.warning("Username can not be empty!");
            return;
        }

        this.$rootScope.username = username;
        this.$location.path(`/play/${channel}`);
    }

    back() {
        this.$location.path("/");
    }

    onChannelListChanged(channels) {
        this.channels = channels;
    }
}