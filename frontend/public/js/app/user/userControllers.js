/* global angular */

angular.module('user')

    .controller('ProfileCtrl', ['$scope', 'Restangular', '_', 'Session', function ($scope, Restangular, _, Session) {
        $scope.userProfile = Restangular.one('users', Session.user._id).get();
        'use strict';
        $scope.update = function () {
            $scope.userProfile.put().then(function (data) {
                _.extend(Session.user, _(data).pick(_(Session.user).keys()));
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

