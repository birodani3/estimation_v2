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
