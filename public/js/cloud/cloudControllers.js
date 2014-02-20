fooformsApp.controller('CloudCtrl', function ($scope, $route, Restangular) {
    "use strict";
    Restangular.setBaseUrl('/api');

    var cloudApi = Restangular.all('clouds');

    // Get all the existing clouds and save them in the scope
    cloudApi.getList().then(function (clouds) {
        $scope.clouds = clouds;
    });

    // Set up a new cloud object to help with cloud creation
    $scope.newCloud = {

    };

    // Create a new cloud
    $scope.createCloud = function (cloud) {
        console.log(JSON.stringify(cloud));
        cloudApi.post(cloud);
    };

    // Update and existing cloud
    $scope.updateCloud = function (cloud) {
        cloud.put();
    };

    // Delete and existing cloud
    $scope.deleteCloud = function (cloud) {
        cloud.remove();
    };
});