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
    };
})
    .controller('PeopleCtrl', function ($scope, $http, Restangular) {
        "use strict";

        var users = [
            {displayName: "Ann", photo: "gvg"},
            {displayName: "Adam", photo: "jhbh"},
            {displayName: "Rob", photo: "kjhjk"}
        ];

        $scope.selectedUser = "";
        $scope.searchUsers = users;



        $scope.getLocation = function(val) {
            return $http.get('/api/users', {
                params: {
                    displayName: val
                }
            }).then(function(res){
                var addresses = [];
                angular.forEach(res.data, function(item){
                    addresses.push(item.displayName);
                });
                return addresses;
            });
        };
    });

