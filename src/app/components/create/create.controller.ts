declare function require(string): string;

import * as angular from 'angular';

import { SettingsController } from './modaldialogs/settings/settings.controller';
import { ISocketService, IToastService, IStoreService } from '../../services';

/* @ngInject */
export class CreateController {
    channel: string;
    isPrivate: boolean;
    password: string;
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

    createChannel(): void {
        this.channel = this.channel.trim();

        if (!this.channel) {
            return;
        }

        const values = this.settings.values
            .filter(value => value.checked)
            .map(value => value.label);

        const payload = {
            name: this.channel,
            password: this.isPrivate ? this.password : null,
            values
        };

        this.socket.emit('CREATE_CHANNEL', payload, (data) => {
            if (!data.error) {
                this.$cookies.put('channel', this.channel);
                this.$rootScope.channel = this.channel;
                this.$location.path(`/results/${this.channel}`);
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
