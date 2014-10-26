/* global angular */

angular.module('user')

    .controller('ProfileCtrl', ['$scope', 'Restangular', '_', 'Session', function ($scope, Restangular, _, Session) {
        'use strict';
        $scope.userProfile = Restangular.copy(Session.user);

        // Remove stuff that doesn't get updated in the profile page
        delete $scope.userProfile.organisations;
        delete $scope.userProfile.teams;
        delete $scope.userProfile.folders;
        delete $scope.userProfile.defaultFolder;

        $scope.update = function () {
            $scope.userProfile.put().then(function (data) {
                Session.user = _.extend(Session.user, _(data).pick(_(Session.user).keys()));
            }, function (err) {
                console.log("There was an error saving");
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

