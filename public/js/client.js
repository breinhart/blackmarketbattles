var app = angular.module('app', [
    'ngRoute',

    'btford.socket-io',
    'app.lobby',
    'app.battle',
    'app.services'
])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/lobby', {
                templateUrl: '/views/partials/lobby/index.html',
                controller: 'LobbyController',
                controllerAs: 'lobby'
            })
            .when('/battle', {
                templateUrl: '/views/partials/battle/index.html',
                controller: 'BattleController',
                controllerAs: 'list'
            })
            .when('/battle/:gameId', {
                templateUrl: '/views/partials/battle/game.html',
                controller: 'BattleController',
                controllerAs: 'vm'
            })
            .when('/About', {
                templateUrl: '/views/partials/about.html',
                controller: 'AboutController',
                controllerAs: 'vm'
            })
            .when('/', {
                templateUrl: '/views/partials/main.html',
                controller: 'MainController',
                controllerAs: 'main'
            })
            .otherwise('/');

    }])
    .run(function($rootScope, $location) {
        //We want to ensure that after a refresh, the user re-logs in
        //This is because of an issue I had with sockets that I was unable to solve in this short time
        //I will revist this later and figure it out.
        /*$rootScope.authenticated = false;
        $rootScope.$on('$routeChangeStart', function(event, next, current) {
            if(!$rootScope.authenticated)
                $location.path('/');
        })*/
    })
    .factory('socket', function(socketFactory) {
        return socketFactory({
            ioSocket: io()
        });
    })
    .controller('MainController', ['$rootScope'
        , '$scope'
        , '$route'
        , '$location'
        , 'socket'
        , 'User'
        , function($rootScope, $scope, $route, $location, socket, User) {
        var main = this;
        main.username = "";
        main.errorText = "";
        main.hasError = false;

        main.user = {};
        main.userExists = false;
        main.login = login;
        main.logout = logout;

        activate();

        function activate() {
            main.user = User.getUser();
            main.userExists = User.exists();

            $scope.$on('user:updated', function(user) {
                $rootScope.authenticated = true;
                $location.url('/lobby');
            });
            $scope.$on('user:updateFailed', function(evt, data) {
                main.errorText = data.message;
                main.hasError = true;
                main.userExists = false;
            });
        }

        function login() {
            //if we are already logged in
            if(main.userExists) {
                main.username = main.user.name;
            }
            User.create(main.username);
        }
        function logout() {
            User.remove();
            main.userExists = false;
        }
    }])
    .controller('AboutController',function() {

    });
