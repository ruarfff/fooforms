fooformsApp.controller('DashboardCtrl', ['$scope', '$http' , '$modal', 'Restangular', 'appService', 'CloudService', 'Clouds', 'PostService', 'Posts', function ($scope, $http, $modal, Restangular, appService, CloudService, Clouds, PostService, Posts) {
    'use strict';
    var appApi = Restangular.all('apps');


    $scope.posts = {};

    $scope.selectedView = "/partials/dashboardFeed.html";


    // the main object to store the app data
    $scope.app = appService.getApp();

    $scope.gridData = [];
    $scope.gridOptions = { data: 'gridData' };



    var posts2Grid = function () {

        angular.forEach($scope.posts, function (postEntry) {
            var map = _.pick(postEntry, 'menuLabel', 'fields');
            var tempPosts = [];
            angular.forEach(map.fields, function (field) {

                var reduce = _.pick(field, 'label', 'value');
                tempPosts.push(reduce);
            });
            $scope.gridData.push(tempPosts);

        })


    }

    var getApps = function () {
        appApi.getList().then(function (apps) {
            $scope.apps = apps;
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
    };

    CloudService.getClouds(function(err) {
        if(!err) {
            $scope.privateClouds = Clouds.privateClouds;
            $scope.publicClouds = Clouds.publicClouds;
        }
    });
    PostService.getPosts(function (err) {
       if(!err) {
           $scope.posts = Posts.posts;
           $scope.postObj = $scope.posts[0];
           posts2Grid();
       }
    });

    // Get all the existing apps and save them in the scope
    getApps();
}]);