import * as angular from 'angular';

export interface IStoreService {
    set: (key: string, data: any) => void;
    get: (key: string) => any;
}

/* @ngInject */
export class StoreService implements IStoreService {
    private store: { [key: string]: any };

    constructor() {
        this.store = {
            settings: {
                values: [
                    {label: 0, checked: false, type: 'number'},
                    {label: '½', checked: false, type: 'number'},
                    {label: 1, checked: true, type: 'number'},
                    {label: 2, checked: true, type: 'number'},
                    {label: 3, checked: true, type: 'number'},
                    {label: 5, checked: true, type: 'number'},
                    {label: 8, checked: true, type: 'number'},
                    {label: 13, checked: true, type: 'number'},
                    {label: 20, checked: true, type: 'number'},
                    {label: 40, checked: true, type: 'number'},
                    {label: '?', checked: true, type: 'general'},
                    {label: '∞', checked: true, type: 'general'},
                    {label: 'XXS', checked: false, type: 't-shirt'},
                    {label: 'XS', checked: false, type: 't-shirt'},
                    {label: 'S', checked: false, type: 't-shirt'},
                    {label: 'M', checked: false, type: 't-shirt'},
                    {label: 'L', checked: false, type: 't-shirt'},
                    {label: 'XL', checked: false, type: 't-shirt'},
                    {label: 'XXL', checked: false, type: 't-shirt'}
                ]
            }
        };
    }

    set(key: string, data: any): void {
        this.store[key] = data;
    }

    get(key: string): any {
        const path = key.split('.');
        let data = this.store;

        path.forEach(pathKey => {
            data = data[pathKey];

            if (!angular.isDefined(data)) {
                throw `No store entry found with key ${key}`;
            }
        });

        return data;
    }
}
