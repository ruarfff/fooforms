'use strict';
var fooformsApp = angular.module('fooformsApp', ['ngRoute', 'restangular', 'ui.bootstrap', 'textAngular', 'ui.calendar']);

// configure our routes
fooformsApp.config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

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
            templateUrl: '/partials/apps'
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
        .otherwise({
            redirectTo: '/404'
        });
});