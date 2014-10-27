/* global angular */

angular.module('authentication')
    .controller('AuthCtrl', ['$scope', '$modal', '$location', '$log', function ($scope, $modal, $location, $log) {
        var modalInstance;
        var template;
        var controller;
        var size;

        if ($location.path() === '/signup') {
            template = 'signupContent.html';
            controller = 'SignupCtrl';
            size = 'sm';
        } else if ($location.path() === '/login') {
            template = 'loginContent.html';
            controller = 'LoginCtrl';
            size = 'sm';
        } else {
            window.location.href = '/';
        }

        modalInstance = $modal.open({
            templateUrl: template,
            controller: controller,
            size: size,
            keyboard: false,
            backdrop: 'static',
            backdropClass: 'auth-backdrop',
            windowClass: 'auth-window'
        });

        modalInstance.result.then(function (loggedIn) {
            if (loggedIn) {
                $location.path("/dashboard");
            }
        }, function (err) {
            $log.error(err);
        });
    }])
    .controller('LoginCtrl', ['$scope', '$rootScope', '$cookieStore', '$http', '$modalInstance', 'AUTH_EVENTS', 'AuthService', function ($scope, $rootScope, $cookieStore, $http, $modalInstance, AUTH_EVENTS, AuthService) {
        'use strict';

        $scope.sluggedUsername = '';
        $scope.sluggedOrgName = '';
        $scope.credentials = {
            username: '',
            password: ''
        };
        $scope.loginError = false;

        $scope.login = function (credentials) {
            AuthService.clearCredentials();
            AuthService.setCredentials(credentials.username, credentials.password);
            AuthService.login(credentials).success(function (res) {
                if (AuthService.isAuthenticated) {
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    $modalInstance.close(true);
                } else {
                    $scope.loginError = res.message || 'An error occurred while trying to log you in.';
                }
            }).error(function (res) {
                AuthService.clearCredentials();
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                $scope.loginError = res.message || 'An error occurred while trying to log you in.';
            });
        };

    }])
    .controller('LogoutCtrl', ['$scope', '$rootScope', 'AUTH_EVENTS', 'AuthService', function ($scope, $rootScope, AUTH_EVENTS, AuthService) {
        'use strict';

        $scope.logout = function () {
            AuthService.clearCredentials();
            $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            window.location = '/';
        };
    }])
    .controller('SignupCtrl', ['$scope', function ($scope) {
        'use strict';

        $scope.container = {};

        $scope.signupStage = 1;

        $scope.validateStageOne = function () {
            $scope.signupStage = 2;
        }

    }]);
