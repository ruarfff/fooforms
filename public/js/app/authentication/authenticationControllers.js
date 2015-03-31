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
            windowClass: 'auth-window modal-trans'
        });

        modalInstance.result.then(function (loggedIn) {
            if (loggedIn) {
                $location.path("/dashboard");
            }
        }, function (err) {
            $log.error(err);
        });
    }])
    .controller('LoginCtrl', ['$scope', '$rootScope', '$modalInstance', 'AUTH_EVENTS', 'AuthService', function ($scope, $rootScope, $modalInstance, AUTH_EVENTS, AuthService) {
        'use strict';

        $scope.sluggedUsername = '';
        $scope.credentials = {
            username: '',
            password: ''
        };
        $scope.loginError = false;

        $scope.login = function (credentials) {
            AuthService.clearCredentials();
            AuthService.setCredentials(credentials.username, credentials.password);
            // Note: not posting anything in the login as the credentials get passed in the header
            AuthService.login().success(function (res) {
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

        $scope.close = function () {
            $modalInstance.close(false);
        }

    }])
    .controller('LogoutCtrl', ['$scope', '$rootScope', 'AUTH_EVENTS', 'AuthService', function ($scope, $rootScope, AUTH_EVENTS, AuthService) {
        'use strict';

        $scope.logout = function () {
            AuthService.clearCredentials();
            $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            window.location = '/';
        };
    }])
    .controller('SignupCtrl', ['$scope', '$rootScope', '$modalInstance', 'AUTH_EVENTS', 'AuthService', function ($scope, $rootScope, $modalInstance, AUTH_EVENTS, AuthService) {
        'use strict';
        $scope.details = {};

        $scope.signupStage = 1;


        $scope.validateStageOne = function () {
            if (!$scope.details.organisationName || !$scope.details.email) {
                $scope.stageOneError = 'Please fill out all required fields';
            } else {
                $scope.signupStage = 2;
            }
        };

        $scope.signup = function (details) {
            AuthService.signup(details).success(function (res) {
                AuthService.clearCredentials();
                AuthService.setCredentials(details.displayName, details.password);

                var credentials = {
                    username: details.displayName,
                    password: details.password
                };

                AuthService.login(credentials).success(function (res) {
                    if (AuthService.isAuthenticated) {
                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                        $modalInstance.close(true);
                    } else {
                        $scope.signupError = res.message || 'An error occurred while trying to log you in.';
                    }
                }).error(function (res) {
                    AuthService.clearCredentials();
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                    $scope.signupError = res.message || 'An error occurred while trying to log you in.';
                });
            }).error(function (res) {
                $scope.signupError = res.message || 'An error occurred while trying to sign you up.';
            });
        };

    }])
    .controller('ForgottenPasswordCtrl', ['$scope', '$modal', '$location', '$log', function ($scope, $modal, $location, $log) {
        'use strict';
        var modalInstance;

        modalInstance = $modal.open({
            templateUrl: 'forgottenPassword.html',
            controller: 'ForgottenPasswordModalCtrl',
            size: 'sm',
            keyboard: false,
            backdrop: 'static',
            backdropClass: 'auth-backdrop',
            windowClass: 'auth-window modal-trans'
        });

        modalInstance.result.then(function () {
            $location.path("/login");
        }, function (err) {
            // TODO: Never happens, or should it........?
            $log.error(err);
            $location.path("/login");
        });

    }])
    .controller('ForgottenPasswordModalCtrl', ['$scope', '$modalInstance', '$location', 'SweetAlert', 'PasswordService', function ($scope, $modalInstance, $location, SweetAlert, PasswordService) {
        'use strict';

        $scope.sendReset = function (email) {
            PasswordService.sendReset(email, function () {

                SweetAlert.swal({
                    title: "Sent",
                    text: "An email has been sent with instructions for resetting your password.",
                    type: "success"
                }, function () {
                    $modalInstance.close();
                });

            });
        };

    }])
    .controller('ResetPasswordCtrl', ['$scope', '$modal', '$location', '$log', function ($scope, $modal, $location, $log) {
        'use strict';
        var modalInstance;

        modalInstance = $modal.open({
            templateUrl: 'resetPassword.html',
            controller: 'ResetPasswordModalCtrl',
            size: 'sm',
            keyboard: false,
            backdrop: 'static',
            backdropClass: 'auth-backdrop',
            windowClass: 'auth-window modal-trans'
        });

        modalInstance.result.then(function () {
            $location.path("/login");
        }, function (err) {
            $log.error(err);
            $location.path("/login");
        });

    }])
    .controller('ResetPasswordModalCtrl', ['$scope', '$modalInstance', '$stateParams', 'PasswordService', function ($scope, $modalInstance, $stateParams, PasswordService) {
        'use strict';

        $scope.resetError = false;

        $scope.updatePassword = function (password) {
            var args = {
                password: password,
                token: $stateParams.token
            };
            PasswordService.updatePassword(args, function (err) {
                $modalInstance.close(err);
            });

        };

    }]);
