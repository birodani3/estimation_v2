import homeTemplate from "./components/home/home.html"
import createTemplate from "./components/create/create.html"
import joinTemplate from "./components/join/join.html"
import resultsTemplate from "./components/results/results.html"
import playTemplate from "./components/play/play.html"

/*@ngInject*/
export default function config($routeProvider, $cookiesProvider, $mdThemingProvider) {
    $routeProvider
        .when("/", {
            template: homeTemplate,
            controller: "HomeController",
            controllerAs: "vm"
        })
        .when("/create", {
            template: createTemplate,
            controller: "CreateController",
            controllerAs: "vm"
        })
        .when("/join", {
            template: joinTemplate,
            controller: "JoinController",
            controllerAs: "vm"
        })
        .when("/results/:channel", {
            template: resultsTemplate,
            controller: "ResultsController",
            controllerAs: "vm",
            resolve: {
                access: ["$rootScope", "$location", access]
            }
        })
        .when("/play/:channel", {
            template: playTemplate,
            controller: "PlayController",
            controllerAs: "vm"
        })
        .otherwise({
            redirectTo: "/"
        });

    $cookiesProvider.defaults.expires = "2030-12-30T12:00:00.000Z";

    $mdThemingProvider.theme("success");
    $mdThemingProvider.theme("error");
    $mdThemingProvider.theme("warning");

    function access($rootScope, $location) {
        if (!$rootScope.channel) {
            $location.path("/");
        }
    }
};
