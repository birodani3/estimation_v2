import SettingsController from "./modaldialogs/settings/settings.controller.js";
import settingsTemplate from "./modaldialogs/settings/settings.html";

/*@ngInject*/
export default class CreateController {
    constructor($rootScope, $location, $mdDialog, $cookies, socket, toast) {
        this.$rootScope = $rootScope;
        this.$location = $location;
        this.$mdDialog = $mdDialog;
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

    openSettings(event) {
        this.$mdDialog.show({
            template: settingsTemplate,
            controller: ["$scope", "$mdDialog", SettingsController],
            parent: angular.element(document.body),
            targetEvent: event,
            openFrom: "#settings-menu-button",
            closeTo: "#settings-menu-button",
            clickOutsideToClose: true
        });
    }

    back() {
        this.$location.path("/");
    }
}
