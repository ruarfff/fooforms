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
    .controller('PeopleCtrl', function ($scope, Restangular) {
        "use strict";
/**
        var users = [
            {displayName: "Ann", photo: ""},
            {displayName: "Adam", photo: ""},
            {displayName: "Rob", photo: ""}
        ];

        $scope.selectedUser = undefined;
        $scope.searchUsers = users;
    });**/