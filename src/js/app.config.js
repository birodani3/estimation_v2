import homeTemplate from "./components/home/home.html"
import createTemplate from "./components/create/create.html"
import joinTemplate from "./components/join/join.html"
import resultsTemplate from "./components/results/results.html"
import estimateTemplate from "./components/estimate/estimate.html"

/*@ngInject*/
export default function config($routeProvider, $cookiesProvider) {
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
        .when("/results", {
            template: resultsTemplate,
            controller: "ResultsController",
            controllerAs: "vm",
            resolve: {
                access: ["$rootScope", "$location", access]
            }
        })
        .when("/estimate", {
            template: estimateTemplate,
            controller: "EstimateController",
            controllerAs: "vm",
            resolve: {
                access: ["$rootScope", "$location", access]
            }
        })
        .otherwise({
            redirectTo: "/"
        });

    $cookiesProvider.defaults.expires = "2030-12-30T12:00:00.000Z";

    function access($rootScope, $location) {
        if (!$rootScope.channel) {
            $location.path("/");
        }
    }
};
