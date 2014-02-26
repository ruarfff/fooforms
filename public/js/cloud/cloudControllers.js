fooformsApp.controller('CloudCtrl', function ($scope, $route, Restangular) {
    "use strict";
    Restangular.setBaseUrl('/api');
    Restangular.setDefaultHeaders({'Content-Type': 'application/json'});

    var cloudApi = Restangular.all('clouds');

    /**
     * Gets the clouds owned by this user
     *
     * TODO: Using updateCloudList all over the place for now. Can make this a lot more efficient by using the server response.
     */
    var updateCloudList = function () {
        cloudApi.getList().then(function (clouds) {
            $scope.clouds = clouds;
        });
    };

    // Get all the existing clouds and save them in the scope
    updateCloudList();

    // Set up a new cloud object to help with cloud creation
    $scope.newCloud = {};

    // Create a new cloud
    $scope.createCloud = function (cloud) {
        cloudApi.post(cloud).then(function (res) {
            updateCloudList();
        }, function (err) {
            console.log(err.status);
        });
    };

    // Update and existing cloud
    $scope.updateCloud = function (cloud) {
        cloud.put().then(function (res) {
            updateCloudList();
        });
    };

    // Delete and existing cloud
    $scope.deleteCloud = function (cloud) {
        cloud.remove().then(function (res) {
            updateCloudList();
        }, function (err) {
            console.log(err.status);
        });
    };

});