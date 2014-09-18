/* global angular */

angular.module('user')

    .controller('ProfileCtrl', function ($scope, Restangular) {
    'use strict';
    Restangular.one('user', 'me').get().then(function (user) {
        $scope.user = user;
    });

    $scope.update = function (user) {
        $scope.user = angular.copy(user);
        $scope.user.put();
        $scope.$parent.$parent.user = angular.copy($scope.user);
    };
})
    .controller('PeopleCtrl', function ($scope, $http, Restangular) {
        "use strict";
        $scope.selectedUser = "";


        $scope.getUsers = function(val) {
            return $http.get('/api/users', {
                params: {
                    displayName: val
                }
            }).then(function(res){
                var users = [];
                angular.forEach(res.data, function(item){
                    users.push(item.displayName);
                });
                return users;
            });
        };
    });

