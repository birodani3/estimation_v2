/*@ngInject*/
export default class CreateController {
    constructor($rootScope, $location, $cookies, toastr, socket) {
        this.$rootScope = $rootScope;
        this.$location = $location;
        this.$cookies = $cookies;
        this.toastr = toastr;
        this.socket = socket;
        this.channel = $cookies.get("channel");
    }

    createChannel(channel) {
        channel = channel.trim();

        if (!channel) {
            this.toastr.warning("Room name can not be empty", "Warning");
            return;
        }

        this.socket.emit("CREATE_CHANNEL", channel, (data) => {
            if (!data.error) {
                this.$cookies.put("channel", channel);
                this.$rootScope.channel = channel;
                this.$location.path("/results");
            } else if (data.error === "NAME_ALREADY_EXISTS") {
                this.toastr.warning("Room already exists with this name!", "Warning");
            } else {
                this.toastr.error("Something went wrong, can not create room", "Error");
            }
        });
    }

    back() {
        this.$location.path("/");
    }
}
