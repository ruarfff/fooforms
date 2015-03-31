/* global angular */

angular.module('invite')

    .controller('SendInviteCtrl', ['$scope', '$log', 'SweetAlert', 'InviteService', 'Session', function ($scope, $log, SweetAlert, InviteService, Session) {
        $scope.inviteEmail = '';

        $scope.invite = function () {
            var invite = {
                organisation: Session.user.organisations[0]._id,
                email: $scope.inviteEmail,
                message: $scope.message || ''
            };

            InviteService.createInvitation(invite, function (err, createdInvite) {
                if (err) $log.error(err);
                $scope.inviteError = !createdInvite || createdInvite.status !== 'sent';
                if(!$scope.inviteError) {
                    SweetAlert.swal('Sent!', 'Your invitation has been sent.', 'success');
                }
            });
        }
    }])
    .controller('InviteCtrl', ['$scope', '$modal', '$location', '$log', function ($scope, $modal, $location, $log) {
        var modalInstance;
        var template = 'inviteContent.html';
        var controller = 'InviteModalCtrl';
        var size = 'sm';


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
    .controller('InviteModalCtrl', ['$scope', '$stateParams', 'SweetAlert', '$rootScope', '$modalInstance', 'AUTH_EVENTS', 'AuthService', 'InviteService',
        function ($scope, $stateParams, SweetAlert, $rootScope, $modalInstance, AUTH_EVENTS, AuthService, InviteService) {
        $scope.details = {};
            $scope.busy = InviteService.getInvitation($stateParams.invite).then(function (invite) {
            $scope.invite = invite;
            $scope.orgName = invite.organisation.displayName;
            $scope.details = {
                isInvite: true,
                email: invite.email,
                organisation: invite.organisation._id
            }

        }, function (err) {
            $log.error(err);
        });

        $scope.signup = function () {
            AuthService.signup($scope.details).success(function (res) {
                AuthService.clearCredentials();
                AuthService.setCredentials($scope.details.displayName, $scope.details.password);

                var credentials = {
                    username: $scope.details.displayName,
                    password: $scope.details.password
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
    .controller('OpenInviteCtrl', ['$scope', '$modal', '$location', '$log', function ($scope, $modal, $location, $log) {
        var modalInstance;
        var template = 'inviteContent.html';
        var controller = 'OpenInviteModalCtrl';
        var size = 'sm';


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
    .controller('OpenInviteModalCtrl', ['$scope', '$stateParams', 'SweetAlert', '$rootScope', '$modalInstance', 'AUTH_EVENTS', 'AuthService', 'InviteService',
        function ($scope, $stateParams, SweetAlert, $rootScope, $modalInstance, AUTH_EVENTS, AuthService, InviteService) {
        $scope.details = {};
            $scope.busy = InviteService.getInvitation($stateParams.invite).then(function (invite) {
            $scope.invite = invite;
            $scope.orgName = invite.organisation.displayName;
            $scope.details = {
                isInvite: true,
                email: invite.email,
                organisation: invite.organisation._id
            }

        }, function (err) {
            $log.error(err);
        });

        $scope.signup = function () {
            AuthService.signup($scope.details).success(function (res) {
                AuthService.clearCredentials();
                AuthService.setCredentials($scope.details.displayName, $scope.details.password);

                var credentials = {
                    username: $scope.details.displayName,
                    password: $scope.details.password
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
    }]);