angular.module('fooforms.invite')

    .controller('SendInviteCtrl', ['$scope', '$log', 'SweetAlert', 'InviteService', 'session',
        function ($scope, $log, SweetAlert, InviteService, session) {
            $scope.inviteEmail = '';

            $scope.invite = function () {
                var invite = {
                    organisation: session.user.organisations[0]._id,
                    email: $scope.inviteEmail,
                    message: $scope.message || ''
                };

                InviteService.createInvitation(invite, function (err, createdInvite) {
                    if (err) $log.error(err);
                    $scope.inviteError = !createdInvite || createdInvite.status !== 'sent';
                    if (!$scope.inviteError) {
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
    .controller('InviteModalCtrl', ['$scope', '$routeParams', 'SweetAlert', '$rootScope', '$modalInstance', 'AUTH_EVENTS', 'authService', 'inviteService',
        function ($scope, $routeParams, SweetAlert, $rootScope, $modalInstance, AUTH_EVENTS, authService, inviteService) {
            $scope.details = {};
            $scope.busy = inviteService.getInvitation($routeParams.invite).then(function (invite) {
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
                authService.signup($scope.details).success(function (res) {
                    authService.clearCredentials();
                    authService.setCredentials($scope.details.displayName, $scope.details.password);

                    var credentials = {
                        username: $scope.details.displayName,
                        password: $scope.details.password
                    };

                    authService.login(credentials).success(function (res) {
                        if (authService.isAuthenticated) {
                            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                            $modalInstance.close(true);
                        } else {
                            $scope.signupError = res.message || 'An error occurred while trying to log you in.';
                        }
                    }).error(function (res) {
                        authService.clearCredentials();
                        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                        $scope.signupError = res.message || 'An error occurred while trying to log you in.';
                    });
                }).error(function (res) {
                    $scope.signupError = res.message || 'An error occurred while trying to sign you up.';
                });
            };
        }]);
