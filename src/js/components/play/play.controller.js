/*@ngInject*/
export default class PlayController {
    constructor($rootScope, $scope, $route, $cookies, $location, $mdDialog, toast, socket) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$route = $route;
        this.$cookies = $cookies;
        this.$location = $location;
        this.$mdDialog = $mdDialog;
        this.toast = toast;
        this.socket = socket;

        this.initSocket();

        if (!$rootScope.username) {
            this.openUsernameDialog()
                .then((username) => this.joinChannel(username))
                .catch(() => $location.path("/join"));
        } else {
            this.joinChannel($rootScope.username);
        }
    }

    initSocket(socket) {
        this.socket.on("CHANNEL_DELETED", this.$scope, this.onChannelDeleted.bind(this));
    }

    openUsernameDialog() {
        let confirmDialog = this.$mdDialog.prompt({
            title: "Type in your username",
            placeholder: "Username",
            initialValue: this.$cookies.get("username") || "",
            ok: "Ok",
            cancel: "Cancel"
        });

        return this.$mdDialog
            .show(confirmDialog)
            .finally(() => confirmDialog = undefined);
    }

    joinChannel(username) {
        const channel = this.$route.current.params.channel;

        this.socket.emit("JOIN_CHANNEL", { channel, username }, (data) => {
            console.log("join channel, data: ", data);
            if (!data.error) {
                this.$rootScope.channel = channel;
                this.$rootScope.username = username;
                this.$cookies.put("username", username);
            } else {
                this.$location.path("/join");
            }
        });
    }

    onChannelDeleted() {
        this.toast.warning("Channel deleted");
        this.$rootScope.username = null;
        this.$rootScope.channel = null;
        this.$location.path("/");
    }
}
