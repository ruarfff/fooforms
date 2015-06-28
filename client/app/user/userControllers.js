angular.module('fooforms.user')
    .controller('ProfileCtrl', ['$scope', '$log', 'Restangular', '_', 'session', 'SweetAlert',
        function ($scope, $log, Restangular, _, session, SweetAlert) {
            'use strict';
            $scope.userProfile = Restangular.copy(session.user);

            // Remove stuff that doesn't get updated in the profile page
            delete $scope.userProfile.organisations;
            delete $scope.userProfile.teams;
            delete $scope.userProfile.folders;
            delete $scope.userProfile.defaultFolder;

            $scope.update = function () {
                $scope.userProfile.put().then(function (data) {
                    session.user.name = data.name;
                    session.user.email = data.email;

                    SweetAlert.swal('Updated!', 'Your profile has been saved.', 'success');
                }, function (err) {
                    $log.error(err);
                    SweetAlert.swal('Not Updated!', 'An error occurred trying to update your profile.', 'error');
                });
            };
        }])
    .controller('UserViewCtrl', [function () {
        'use strict';

    }])
    .controller('PeopleCtrl', ['$scope', '$http', function ($scope, $http) {
        'use strict';
        $scope.selectedUser = '';


        $scope.getUsers = function (val) {
            $scope.loadingUsers = true;
            return $http.get('/api/users', {
                params: {
                    username: val
                }
            }).then(function (res) {
                $scope.loadingUsers = false;
                var users = [];
                angular.forEach(res.data, function (item) {
                    users.push(item.displayName);
                });
                return users;
            });
        };
    }]);

