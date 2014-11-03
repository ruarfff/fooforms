/* global angular */

angular.module('user')

    .controller('ProfileCtrl', ['$scope', 'Restangular', '_', 'Session', 'SweetAlert', function ($scope, Restangular, _, Session, SweetAlert) {
        'use strict';
        $scope.userProfile = Restangular.copy(Session.user);

        // Remove stuff that doesn't get updated in the profile page
        delete $scope.userProfile.organisations;
        delete $scope.userProfile.teams;
        delete $scope.userProfile.folders;
        delete $scope.userProfile.defaultFolder;

        $scope.update = function () {
            $scope.userProfile.put().then(function (data) {
                Session.user.name = data.name;
                Session.user.email = data.email;

                SweetAlert.swal('Updated!', 'Your profile has been saved.', 'success');
            }, function (err) {
                SweetAlert.swal('Not Updated!', 'An error occurred trying to update your profile.', 'error');
            });
        };
    }])
    .controller('UserViewCtrl', ['$scope', function ($scope) {
        'use strict';

    }])
    .controller('PeopleCtrl', ['$scope', '$http', function ($scope, $http) {
        "use strict";
        $scope.selectedUser = "";


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

