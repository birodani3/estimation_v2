import _ from 'lodash';
import angular from 'angular'

/*@ngInject*/
export default class StoreService {
    constructor($rootScope) {
        this.$rootScope = $rootScope;
        this.store = {
            settings: {
                values: [
                    { label: 0,   checked: false },
                    { label: '½', checked: false },
                    { label: 1,   checked: true },
                    { label: 2,   checked: true },
                    { label: 3,   checked: true },
                    { label: 5,   checked: true },
                    { label: 8,   checked: true },
                    { label: 13,  checked: true },
                    { label: 20,  checked: true },
                    { label: 40,  checked: true },
                    { label: '?', checked: true },
                    { label: '∞', checked: true }
                ]
            }
        };
    }

    set(key, data) {
        this.store[key] = data;
    }

    get(key) {
        let data = this.store[key];

        if (!angular.isDefined(data)) {
            throw `No store entry found with key ${key}`;
        }

        return data;
    }
}
