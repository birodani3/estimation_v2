import * as angular from 'angular';

import { ValueType } from '../models';

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
                    { label: 0,     checked: false, type: ValueType.Number  },
                    { label: '½',   checked: false, type: ValueType.Number  },
                    { label: 1,     checked: true,  type: ValueType.Number  },
                    { label: 2,     checked: true,  type: ValueType.Number  },
                    { label: 3,     checked: true,  type: ValueType.Number  },
                    { label: 5,     checked: true,  type: ValueType.Number  },
                    { label: 8,     checked: true,  type: ValueType.Number  },
                    { label: 13,    checked: true,  type: ValueType.Number  },
                    { label: 20,    checked: true,  type: ValueType.Number  },
                    { label: 40,    checked: true,  type: ValueType.Number  },
                    { label: '?',   checked: true,  type: ValueType.General },
                    { label: '∞',   checked: true,  type: ValueType.General },
                    { label: 'XXS', checked: false, type: ValueType.TShirt  },
                    { label: 'XS',  checked: false, type: ValueType.TShirt  },
                    { label: 'S',   checked: false, type: ValueType.TShirt  },
                    { label: 'M',   checked: false, type: ValueType.TShirt  },
                    { label: 'L',   checked: false, type: ValueType.TShirt  },
                    { label: 'XL',  checked: false, type: ValueType.TShirt  },
                    { label: 'XXL', checked: false, type: ValueType.TShirt  }
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
