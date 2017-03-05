/*@ngInject*/
export default class JoinController {
    constructor($scope, $location, $cookies, toastr, socket) {
        this.$scope = $scope
        this.$location = $location;
        this.$cookies = $cookies;
        this.toastr = toastr;
        this.socket = socket;
        this.channels = [];
        this.username = $cookies.get("username") || "";

        socket.emit("GET_CHANNELS", null, this.onChannelListChanged.bind(this));
        socket.on("CHANNEL_LIST", this.onChannelListChanged.bind(this));

        $scope.$on("$destroy", () => {
            socket.off("CHANNEL_LIST", this.onChannelListChanged.bind(this));
        });
    }

    joinChannel(username, channel) {
        username = username.trim();

        if (!username) {
            this.toastr.warning("Username can not be empty!", "Warning");
            return;
        }

        this.socket.emit("JOIN_CHANNEL", channel, (data) => {
            console.log("join channel, data: ", data);
            if (!data.error) {
                this.$location.path("/estimate");
            }
        });
    }

    back() {
        this.$location.path("/");
    }

    onChannelListChanged(channels) {
        this.channels = channels;
    }
}