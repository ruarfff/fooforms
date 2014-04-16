/* global angular */

angular.module('authentication').controller('LoginCtrl', function ($scope, $rootScope, AUTH_EVENTS, AuthService) {
    'use strict';

    AuthService.checkStoredCredentials(function (err) {
        if(!err) {
            window.location = '/dashboard';
        }
    });

    $scope.credentials = {
        username: '',
        password: ''
    };
    $scope.login = function (credentials) {
        AuthService.setCredentials(credentials.username, credentials.password);
        AuthService.login(credentials).then(function () {
            if(AuthService.isAuthenticated) {
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            }
            window.location = '/dashboard';
        }, function () {
            AuthService.clearCredentials();
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };

});

angular.module('authentication').controller('LogoutCtrl', function ($scope, $rootScope, AUTH_EVENTS, AuthService) {
    'use strict';

    $scope.logout = function() {
        AuthService.clearCredentials();
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
        window.location = '/';
    };
});