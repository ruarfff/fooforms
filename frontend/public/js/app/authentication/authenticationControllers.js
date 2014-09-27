/* global angular */

angular.module('authentication').controller('LoginCtrl', ['$scope', '$rootScope', '$cookieStore', '$http', 'AUTH_EVENTS', 'AuthService', function ($scope, $rootScope, $cookieStore, $http, AUTH_EVENTS, AuthService) {
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
                $http.defaults.headers.common['Authorization'] = 'Basic ' + $cookieStore.get('authdata');
                window.location = '/dashboard';
            } else {
                $scope.loginError = res.message || 'An error occurred while trying to log you in.';
            }
        }).error(function (res) {
            AuthService.clearCredentials();
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            $scope.loginError = res.message || 'An error occurred while trying to log you in.';
        });
    };

}]);

angular.module('authentication').controller('LogoutCtrl', function ($scope, $rootScope, AUTH_EVENTS, AuthService) {
    'use strict';

    $scope.logout = function() {
        AuthService.clearCredentials();
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
        window.location = '/';
    };
});
