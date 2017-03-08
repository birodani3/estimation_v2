import angular from "angular";
import ngRoute from "angular-route";
import ngCookies from "angular-cookies";
import ngAnimate from "angular-animate";
import ngAria from "angular-aria";
import ngMaterial from "angular-material";
import ngMessages from "angular-messages";
import config from "./app.config.js";
import SocketService from "./services/socket.service.js";
import ToastService from "./services/toast.service.js";
import {
    MainController,
    HomeController,
    CreateController,
    JoinController,
    ResultsController,
    PlayController
} from "./components/controllers.js";

// Import styles
import "bootstrap/dist/css/bootstrap.css";
import "../style/font-awesome.min.css"
import "../style/angular-material.min.css"
import "../style/app.css";

const moduleName = "estimation";
const settings = { strictDi: true };
const dependencies = [
    ngRoute,
    ngCookies,
    ngAnimate,
    ngMessages,
    ngAria,
    ngMaterial
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
    .controller("MainController", MainController)
    .controller("HomeController", HomeController)
    .controller("CreateController", CreateController)
    .controller("JoinController", JoinController)
    .controller("ResultsController", ResultsController)
    .controller("PlayController", PlayController);

angular.element(() => {
    angular.bootstrap(document, [moduleName], settings);
});
