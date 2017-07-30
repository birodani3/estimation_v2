declare function require(string): string;
import { ToastTheme } from './services';

/* @ngInject */
export function Config($routeProvider, $sceDelegateProvider, $cookiesProvider, $mdThemingProvider) {
    $routeProvider
        .when('/', {
            template: require('./components/home/home.html'),
            controller: 'HomeController',
            controllerAs: 'vm'
        })
        .when('/create', {
            template: require('./components/create/create.html'),
            controller: 'CreateController',
            controllerAs: 'vm'
        })
        .when('/join', {
            template: require('./components/join/join.html'),
            controller: 'JoinController',
            controllerAs: 'vm'
        })
        .when('/results/:channel', {
            template: require('./components/results/results.html'),
            controller: 'ResultsController',
            controllerAs: 'vm',
            resolve: {
                access: ['$rootScope', '$location', access]
            }
        })
        .when('/play/:channel', {
            template: require('./components/play/play.html'),
            controller: 'PlayController',
            controllerAs: 'vm'
        })
        .otherwise({
            redirectTo: '/'
        });

    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://jira.cas.de/**'
    ]);

    $cookiesProvider.defaults.expires = '2030-12-30T12:00:00.000Z';

    $mdThemingProvider.theme(ToastTheme.Success);
    $mdThemingProvider.theme(ToastTheme.Error);
    $mdThemingProvider.theme(ToastTheme.Warning);

    function access($rootScope, $location) {
        if (!$rootScope.channel) {
            $location.path('/');
        }
    }
};
