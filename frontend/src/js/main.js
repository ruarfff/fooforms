var fooformsApp = angular.module('fooformsApp', [
    'ngRoute', 'restangular', 'ui.bootstrap', 'textAngular', 'ui.calendar', 'ngGrid'
]);

// configure our routes
fooformsApp.config(function ($routeProvider, $locationProvider, RestangularProvider) {
    'use strict';
    $locationProvider.html5Mode(true).hashPrefix('!');

    RestangularProvider.setErrorInterceptor(
        function (res) {
            if(res.status === 401) {
                window.location.href = '/login';
            }
            return false; // stop the promise chain
        });
    RestangularProvider.setBaseUrl('/api');
    RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});

    $routeProvider
        .when('/', {
            redirectTo: '/dashboard'
        })
        .when('/dashboard', {
            templateUrl: '/partials/dashboard',
            controller: 'DashboardCtrl'
        })
        .when('/clouds', {
            templateUrl: '/partials/clouds',
            controller: 'CloudCtrl'
        })
        .when('/apps', {
            templateUrl: '/partials/apps',
            controller: 'AppsCtrl'
        })
        .when('/people', {
            templateUrl: '/partials/people'
        })
        .when('/calendar', {
            templateUrl: '/partials/calendar'
        })
        .when('/profile', {
            templateUrl: '/partials/profile',
            controller: 'ProfileCtrl'
        })
        .when('/userGuide', {
            templateUrl: '/partials/userGuide'
        })
        .when('/settings', {
            templateUrl: '/partials/settings'
        })
        .when('/admin', {
            templateUrl: '/partials/admin'
        })
        .when('/appBuilder', {
            templateUrl: '/partials/appBuilder',
            controller: 'fieldsCtrl'
        })
        .when('/posts', {
            templateUrl: '/partials/appViewer',
            controller: 'appViewerCtrl'
        })
        .otherwise({
            templateUrl: '/partials/appViewer',
            controller: 'appViewerCtrl'
        });
}).factory('authHttpResponseInterceptor', ['$q', '$location', function ($q, $window) {
    return {
        response: function (response) {
            if (response.status === 401) {
                console.log("Response 401");
            }
            return response || $q.when(response);
        },
        responseError: function (rejection) {
            if (rejection.status === 401) {
                console.log("Response Error 401", rejection);
                window.location.href = '/login';
                //$location.path('/login');
            }
            return $q.reject(rejection);
        }
    }
}]).config(['$httpProvider', function ($httpProvider) {
    //Http Intercpetor to check auth failures for xhr requests
    $httpProvider.interceptors.push('authHttpResponseInterceptor');
}]);


fooformsApp.controller('MainController', function ($scope, $location, USER_ROLES, AuthService) {
    $scope.user = null;
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AuthService.isAuthorized;

    $scope.init = function () {
        AuthService.checkUser(function (user) {
            if (AuthService.isAuthenticated()) {
                $scope.user = user;
            } else {
                window.location.href = '/login';
            }
        });
    };
});
