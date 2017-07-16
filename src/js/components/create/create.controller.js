import SettingsController from './modaldialogs/settings/settings.controller.js';
import settingsTemplate from './modaldialogs/settings/settings.html';

/*@ngInject*/
export default class CreateController {
    constructor($rootScope, $location, $mdDialog, $cookies, socket, toast, store) {
        this.$rootScope = $rootScope;
        this.$location = $location;
        this.$mdDialog = $mdDialog;
        this.$cookies = $cookies;
        this.socket = socket;
        this.toast = toast;
        this.store = store;
        this.channel = $cookies.get('channel') || '';
        this.settings = store.get('settings');
    }

    createChannel(channel) {
        channel = channel.trim();

        if (!channel) {
            return;
        }

        let values = this.settings.values
            .filter(value => value.checked)
            .map(value => value.label);

        let payload = {
            name: channel,
            values
        };

        this.socket.emit('CREATE_CHANNEL', payload, (data) => {
            if (!data.error) {
                this.$cookies.put('channel', channel);
                this.$rootScope.channel = channel;
                this.$location.path(`/results/${channel}`);
            } else if (data.error === 'NAME_ALREADY_EXISTS') {
                this.toast.warning('Room already exists with this name!');
            } else {
                this.toast.error('Something went wrong, can not create room');
            }
        });
    }

    openSettings(event) {
        this.$mdDialog.show({
            template: settingsTemplate,
            controller: ['$scope', '$mdDialog', 'store', SettingsController],
            parent: angular.element(document.body),
            targetEvent: event,
            openFrom: '#settings-menu-button',
            closeTo: '#settings-menu-button',
            clickOutsideToClose: true
        })
        .then(settings => {
            this.settings = settings;
            this.store.set('settings', settings);
        });
    }

    back() {
        this.$location.path('/');
    }
}
