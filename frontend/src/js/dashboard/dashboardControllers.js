fooformsApp.controller('DashboardCtrl', ['$scope', '$http' , '$modal', 'Restangular', 'appService', function ($scope, $http, $modal, Restangular, appService) {
    'use strict';
    var appApi = Restangular.all('apps');
    var postApi = Restangular.all('posts');
    var cloudApi = Restangular.all('clouds');

    $scope.posts = {};

    $scope.selectedView = "/partials/dashboardFeed.html";


    // the main object to store the app data
    $scope.app = appService.getApp();

    $scope.gridData = [];
    $scope.gridOptions = { data: 'gridData' };


    // some booleans to help track what we are editing, which tabs to enable, etc.
    // used in ng-show in appBuilderMenu

    var getPosts = function () {
        postApi.getList().then(function (posts) {
            $scope.posts = posts;
            $scope.postObj = $scope.posts[0];
            posts2Grid();
        });
    };

    var posts2Grid = function () {

        angular.forEach($scope.posts, function (postEntry) {
            var map = _.pick(postEntry, 'menuLabel', 'fields');
            var tempPosts = [];
            angular.forEach(map.fields, function (field) {

                var reduce = _.pick(field, 'label', 'value');
                tempPosts.push(reduce);
            })
            $scope.gridData.push(tempPosts);

        })


    }

    var getApps = function () {
        appApi.getList().then(function (apps) {
            $scope.apps = apps;
        });
    };

    var getClouds = function () {
        cloudApi.getList().then(function (clouds) {
            $scope.clouds = clouds;
        });
    };

    $scope.updateApp = function (app) {
        appService.setApp(app);

    };

    $scope.setView = function (view) {

        switch (view) {
            case "feed" :
                $scope.selectedView = "/partials/dashboardFeed.html";
                break;
            case "grid" :
                $scope.selectedView = "/partials/dashboardGrid.html";
                break;
            case "card" :
                $scope.selectedView = "/partials/dashboardCard.html";
                break;
        }
    }

    // Get all the existing apps and save them in the scope
    getPosts();
    getApps();
    getClouds();
}]);