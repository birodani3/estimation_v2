import _ from 'lodash';

/*@ngInject*/
export default class HoverService {
    constructor() {

    }

    bag(name, scope) {
        let callbacks = [];

        return {
            on: function(event, callback) {
                callbacks.push({ event, fn: callback });

                return this;
            },

            use: () => {
                callbacks.forEach(callback => {
                    scope.$on(`${name}.${callback.event}`, callback.fn);
                });
            }
        }
    }
}