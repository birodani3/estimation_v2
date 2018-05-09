declare function require(string): string;

import * as angular from 'angular';

import { SettingsController } from './modaldialogs/settings/settings.controller';
import { ISocketService, IToastService, IStoreService } from '../../services';

/* @ngInject */
export class CreateController {
    channel: string;
    settings: any;

    constructor(
        private $rootScope,
        private $location: ng.ILocationService,
        private $mdDialog: ng.material.IDialogService,
        private $cookies: ng.cookies.ICookiesService,
        private socket: ISocketService,
        private toast: IToastService,
        private store: IStoreService
    ) {
        this.channel = $cookies.get('channel') || '';
        this.settings = store.get('settings');
    }

    createChannel(name: string, password: string): void {
        name = name.trim();

        if (!name) {
            return;
        }

        const values = this.settings.values
            .filter(value => value.checked)
            .map(value => value.label);

        const payload = { name, password, values };

        this.socket.emit('CREATE_CHANNEL', payload, (data) => {
            if (!data.error) {
                this.$cookies.put('channel', name);
                this.$rootScope.channel = name;
                this.$location.path(`/results/${name}`);
            } else if (data.error === 'NAME_ALREADY_EXISTS') {
                this.toast.warning('Room already exists with this name!');
            } else {
                this.toast.error('Something went wrong, can not create room');
            }
        });
    }

    openSettings(event): void {
        this.$mdDialog.show({
            template: require('./modaldialogs/settings/settings.html'),
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

    back(): void {
        this.$location.path('/');
    }
}
