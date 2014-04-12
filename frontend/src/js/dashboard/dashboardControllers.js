fooformsApp.controller('DashboardCtrl', ['$scope', '$location', '$http' , '$modal', 'Restangular', 'FormService', 'Forms', 'CloudService', 'Clouds', 'PostService', 'Posts', function ($scope, $location, $http, $modal, Restangular, FormService, Forms, CloudService, Clouds, PostService, Posts) {
    'use strict';
    // the main object to store the form data
    $scope.form = Forms.getCurrentForm();
    $scope.posts = [];
    $scope.selectedView = "/partials/dashboardFeed.html";

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

        });
    };

    $scope.updateForm = function (form) {
        Forms.setCurrentForm(form);
        Posts.activePost = null;
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

    $scope.viewPost = function (post) {
        var form = Forms.findById(post.form);
        Posts.activePost = post;
        Forms.setCurrentForm(form);
        $location.path(form.name);
    };

    CloudService.getClouds(function (err) {
        if (!err) {
            $scope.privateClouds = Clouds.privateClouds;
            $scope.publicClouds = Clouds.publicClouds;
        }
    });
    PostService.getUserPosts(function (err) {
        if (!err) {
            $scope.posts = Posts.posts;
            $scope.postObj = $scope.posts[0];
            posts2Grid();
        }
    });
    FormService.getUserForms(function (err) {
        if (!err) {
            $scope.forms = Forms.forms;
        }
    });

}]);