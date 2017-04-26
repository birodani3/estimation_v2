import angular from "angular";
import ngRoute from "angular-route";
import ngCookies from "angular-cookies";
import ngAnimate from "angular-animate";
import ngAria from "angular-aria";
import ngMaterial from "angular-material";
import ngMessages from "angular-messages";
import angularDragula from "../../node_modules/angularjs-dragula/angular-dragula.js";
import config from "./app.config.js";
import SocketService from "./services/socket.service.js";
import ToastService from "./services/toast.service.js";
import HoverService from "./services/hover.service.js";
import StoreService from "./services/store.service.js";
import MainController from "./components/main.controller.js";
import HomeController from "./components/home/home.controller.js";
import CreateController from "./components/create/create.controller.js";
import JoinController from "./components/join/join.controller.js";
import ResultsController from "./components/results/results.controller.js";
import PlayController from "./components/play/play.controller.js";

// Import styles
import "bootstrap/dist/css/bootstrap.css";
import "../style/font-awesome.min.css"
import "../style/angular-material.min.css"
import "../style/dragula.css"
import "../style/app.css";

const moduleName = "estimation";
const settings = { strictDi: true };
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
    .config(config)
    .service("socket", SocketService)
    .service("toast", ToastService)
    .service("hover", HoverService)
    .service("store", StoreService)
    .controller("MainController", MainController)
    .controller("HomeController", HomeController)
    .controller("CreateController", CreateController)
    .controller("JoinController", JoinController)
    .controller("ResultsController", ResultsController)
    .controller("PlayController", PlayController)
    .value("dragulaBagId", "ticket-container")
    .config(['$provide', ($provide) => {
        // DEBUG

        /*$provide.decorator('$rootScope', ["$delegate", function ($delegate) {
            var emit = $delegate.$emit;

            $delegate.$emit = function () {
                console.log.apply(console, arguments);
                emit.apply(this, arguments);
            };

            return $delegate;
        }]);*/
    }]);

angular.element(() => {
    angular.bootstrap(document, [moduleName], settings);
});
