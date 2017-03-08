/*@ngInject*/
export default class CreateController {
    constructor($rootScope, $location, $cookies, socket, toast) {
        this.$rootScope = $rootScope;
        this.$location = $location;
        this.$cookies = $cookies;
        this.socket = socket;
        this.toast = toast;
        this.channel = $cookies.get("channel") || "";
    }

    createChannel(channel) {
        channel = channel.trim();

        if (!channel) {
            return;
        }

        this.socket.emit("CREATE_CHANNEL", channel, (data) => {
            if (!data.error) {
                this.$cookies.put("channel", channel);
                this.$rootScope.channel = channel;
                this.$location.path(`/results/${channel}`);
            } else if (data.error === "NAME_ALREADY_EXISTS") {
                this.toast.warning("Room already exists with this name!");
            } else {
                this.toast.error("Something went wrong, can not create room");
            }
        });
    }

    back() {
        this.$location.path("/");
    }
}
