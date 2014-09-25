/* global angular */

angular.module('authentication').controller('LoginCtrl', function ($scope, $rootScope, AUTH_EVENTS, AuthService) {
    'use strict';

    $scope.credentials = {
        username: '',
        password: ''
    };
    $scope.loginError = false;
    $scope.login = function (credentials) {
        AuthService.clearCredentials();
        AuthService.setCredentials(credentials.username, credentials.password);
        AuthService.login(credentials).success(function (res) {
            if(AuthService.isAuthenticated) {
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            }
        }).error(function (res) {
            AuthService.clearCredentials();
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            $scope.loginError = res.message || 'An error occurred while trying to log you in.';
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
