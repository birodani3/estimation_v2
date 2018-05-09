import * as angular from 'angular';
import * as ngRoute from 'angular-route';
import * as ngCookies from 'angular-cookies';
import * as ngMaterial from 'angular-material';
import * as angularDragula from 'angularjs-dragula/dist/angular-dragula.min';
import * as ngMessages from 'angular-messages';
import * as ngAnimate from 'angular-animate';
import * as ngAria from 'angular-aria';

import { Config } from './app.config';
import { SocketService, ToastService, HoverService, StoreService } from './services';
import { MainController } from './components/main.controller';
import { HomeController } from './components/home/home.controller';
import { CreateController } from './components/create/create.controller';
import { JoinController } from './components/join/join.controller';
import { ResultsController } from './components/results/results.controller';
import { PlayController } from './components/play/play.controller';

import 'bootstrap/dist/css/bootstrap.css';
import '../style/angular-material.min.css';
import '../style/dragula.css';
import '../style/app.less';

const moduleName = 'estimation';
const serverUrl = 'localhost:3008';
const dependencies = [
    ngRoute,
    ngCookies,
    ngAnimate,
    ngMessages,
    ngAria,
    ngMaterial,
    angularDragula(angular)
];

/*
 * Estimator v2
 * 
 * @author Daniel Biro
 */
angular
    .module(moduleName, dependencies)
    .config(Config)
    .service('socket', SocketService)
    .service('toast', ToastService)
    .service('hover', HoverService)
    .service('store', StoreService)
    .controller('MainController', MainController)
    .controller('HomeController', HomeController)
    .controller('CreateController', CreateController)
    .controller('JoinController', JoinController)
    .controller('ResultsController', ResultsController)
    .controller('PlayController', PlayController)
    .value('serverUrl', serverUrl)
    .value('dragulaBagId', 'ticket-container')
    .config(['$provide', ($provide) => {
        // DEBUG

        /*$provide.decorator('$rootScope', ['$delegate', ($delegate) => {
            const emit = $delegate.$emit;

            $delegate.$emit = (...args) => {
                console.log.apply(console, args);
                emit.apply(this, args);
            };

            return $delegate;
        }]);*/
    }]);

(<any>angular).element(() => {
    angular.bootstrap(document, [moduleName]);

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js')
            .then(() => { 
                console.log('SW Registered'); 
            });
    }
});
