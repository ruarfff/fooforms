/* global angular */

angular.module('authentication').controller('LoginController', function ($scope, $rootScope, AUTH_EVENTS, AuthService) {
    'use strict';

    $scope.credentials = {
        username: '',
        password: ''
    };
    $scope.login = function (credentials) {
        AuthService.login(credentials).then(function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        }, function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };
});