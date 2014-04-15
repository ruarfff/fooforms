/* global angular */

angular.module('authentication').controller('LoginCtrl', function ($scope, $rootScope, AUTH_EVENTS, AuthService) {
    'use strict';

    if(AuthService.checkStoredCredentials()) {
        window.location = '/dashboard';
    }

    $scope.credentials = {
        username: '',
        password: ''
    };
    $scope.login = function (credentials) {
        AuthService.login(credentials).then(function () {
            if(AuthService.isAuthenticated) {
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                AuthService.setCredentials(credentials.username, credentials.password);
            }
            window.location = '/dashboard';
        }, function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };

    $scope.logout = function() {
        AuthService.clearCredentials();
        window.location = '/';
    };
});