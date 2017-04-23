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

        this.settings = {};
        this.isLoading = false;
        this.initSocket();

        if (!$rootScope.username) {
            this.openUsernameDialog()
                .then(this.joinChannel.bind(this))
                .catch(() => $location.path("/join"));
        } else {
            this.joinChannel($rootScope.username);
        }
    }

    initSocket(socket) {
        this.socket.on("CHANNEL_DELETED", this.$scope, this.onChannelDeleted.bind(this));
        this.socket.on("RESET", this.$scope, this.onReset.bind(this));
    }

    joinChannel(username) {
        const channel = this.$route.current.params.channel;

        this.socket.emit("JOIN_CHANNEL", { channel, username }, (data) => {
            if (!data.error) {
                this.isLoading = true;
                this.settings = data.settings;
                this.$rootScope.channel = channel;
                this.$rootScope.username = username;
                this.$cookies.put("username", username);
            } else {
                this.$location.path("/join");
            }
        });
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

    onChannelDeleted() {
        this.toast.warning("Channel deleted");
        this.$rootScope.username = null;
        this.$rootScope.channel = null;
        this.$location.path("/");
    }

    onReset() {
        this.isLoading = false;
    }
}
