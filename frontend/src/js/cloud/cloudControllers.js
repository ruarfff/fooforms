fooformsApp.controller('CloudCtrl', function ($scope, $route, Restangular) {
    "use strict";

    var cloudApi = Restangular.all('clouds');

    /**
     * Gets the clouds owned by this user
     *
     * TODO: Using updateCloudList all over the place for now. Can make this a lot more efficient by using the server response.
     */

    $scope.tabs = [
        {name: "Clouds", active: true},
        {name: "Settings", active: false}
    ];
    $scope.nowEditing = 0;
    $scope.showBorders = function () {

    };

    var updateCloudList = function () {
        cloudApi.getList().then(function (clouds) {
            $scope.clouds = clouds;

            $scope.privateClouds = [];
            $scope.publicClouds = [];

            var index;
            var count = clouds.length;

            for(index = 0; index < count; index++) {
               if(clouds[index].isPrivate) {
                   $scope.privateClouds.push(clouds[index]);
               } else {
                   $scope.publicClouds.push(clouds[index]);
               }
            }
        });
    };

    // Get all the existing clouds and save them in the scope
    updateCloudList();

    // Set up a new cloud object to help with cloud creation
    $scope.newCloud = {};
    $scope.newTab = {};

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

    // Create a new cloud
    $scope.createTab = function (tab) {


        $scope.tabs.push(angular.copy(tab));
        $scope.$apply();
        angular.element('#' + tab.name).tab('show');
        $scope.newTab = {};


    };

});