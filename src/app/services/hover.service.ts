interface HoverCallback {
    event: string;
    fn: Function;
}

export interface IHoverService {
    bag: (name: string, scope: ng.IScope) => any;
}

/*
 * Usage: hoverService.bag('bagName').on('drag', this.dragHandler).on('drop', this.dropHandler).use();
 */

/* @ngInject */
export class HoverService implements IHoverService {
    constructor() { }

    bag(name: string, scope) {
        const callbacks: HoverCallback[] = [];

        const api = {
            on: (event: string, callback) => {
                callbacks.push({ event, fn: callback });

                return api;
            },

            use: () => {
                callbacks.forEach(callback => {
                    scope.$on(`${name}.${callback.event}`, callback.fn);
                });
            }
        }

        return api;
    }
}