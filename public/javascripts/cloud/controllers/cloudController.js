var fooformsApp = angular.module('fooformsApp', ['restangular']);

fooformsApp.controller('CloudCtrl', function ($scope, Restangular) {
    Restangular.setBaseUrl('/api');

    var cloudApi = Restangular.all('clouds');

    // This will query /accounts and return a promise.
    cloudApi.getList().then(function (clouds) {
        $scope.clouds = clouds;
    });

    $scope.save = function (cloud) {

    }


});