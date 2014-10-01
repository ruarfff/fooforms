/* global angular */

angular.module('user')

    .controller('ProfileCtrl', ['$scope', function ($scope) {
        'use strict';
        $scope.update = function (user) {
            $scope.user = angular.copy(user);
            $scope.user.put();
            Session.user = $scope.user;
        };
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

