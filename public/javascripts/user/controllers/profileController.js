var fooformsApp = angular.module('fooformsApp', ['restangular']);


fooformsApp.controller('ProfileCtrl', function ($scope, Restangular) {
    Restangular.setBaseUrl('/api');
    Restangular.one('user', 'me').get().then(function (user) {
        $scope.user = user;
    });

    $scope.update = function (user) {
        $scope.user = angular.copy(user);
        $scope.user.put();
    };

});


