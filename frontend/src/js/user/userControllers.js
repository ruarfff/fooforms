fooformsApp.controller('ProfileCtrl', function ($scope, $route, Restangular) {
    'use strict';
    Restangular.one('user', 'me').get().then(function (user) {
        $scope.user = user;
    });

    $scope.update = function (user) {
        $scope.user = angular.copy(user);
        $scope.user.put();
    };
});