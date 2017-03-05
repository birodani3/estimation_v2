import angular from "angular";
import ngRoute from "angular-route";
import ngCookies from "angular-cookies";
import ngAnimate from "angular-animate";
import toastr from "angular-toastr";
import config from "./app.config.js";
import SocketService from "./services/socket.service.js";
import {
    MainController,
    HomeController,
    CreateController,
    JoinController,
    ResultsController,
    EstimateController
} from "./components/controllers.js";

// Import styles
import "bootstrap/dist/css/bootstrap.css";
import "../style/font-awesome.min.css"
import "../style/toastr.min.css"
import "../style/app.less";

const moduleName = "estimation";
const settings = { strictDi: true };
const dependencies = [
    ngRoute,
    ngCookies,
    ngAnimate,
    toastr
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
    .controller("MainController", MainController)
    .controller("HomeController", HomeController)
    .controller("CreateController", CreateController)
    .controller("JoinController", JoinController)
    .controller("ResultsController", ResultsController)
    .controller("EstimateController", EstimateController);

angular.element(() => {
    angular.bootstrap(document, [moduleName], settings);
});
