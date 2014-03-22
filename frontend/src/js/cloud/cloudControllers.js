fooformsApp.controller('CloudCtrl', function ($scope, $route, Restangular, CloudService, Clouds) {
    "use strict";

    var cloudUpdateCalback = function(err) {
        if(!err) {
            $scope.clouds = Clouds.clouds;
            $scope.privateClouds = Clouds.privateClouds;
            $scope.publicClouds = Clouds.publicClouds;
        }
    };
    CloudService.getClouds(cloudUpdateCalback);

    $scope.tabs = [
        {name: "Clouds", active: true},
        {name: "Settings", active: false}
    ];
    $scope.nowEditing = 0;
    $scope.showBorders = function () {

    };

    // Set up a new cloud object to help with cloud creation
    $scope.newCloud = {};
    $scope.newTab = {};

    // Create a new cloud
    $scope.createTab = function (tab) {
        $scope.tabs.push(angular.copy(tab));
        $scope.$apply();
        angular.element('#' + tab.name).tab('show');
        $scope.newTab = {};
    };


    // Create a new cloud
    $scope.createCloud = function (cloud) {
        CloudService.createCloud(cloud, cloudUpdateCalback);
    };

    // Update and existing cloud
    $scope.updateCloud = function (cloud) {
        CloudService.updateCloud(cloud, cloudUpdateCalback);
    };

    // Delete and existing cloud
    $scope.deleteCloud = function (cloud) {
        CloudService.deleteCloud(cloud, cloudUpdateCalback);
    };

});