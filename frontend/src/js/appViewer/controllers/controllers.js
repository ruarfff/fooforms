/* Controllers */

fooformsApp.controller('appViewerCtrl', ['$scope', '$http' , '$modal', 'Restangular', 'appService','PostService', 'Posts', function ($scope, $http, $modal, Restangular, appService, PostService, Posts) {
    "use strict";

    // the main object to store the app data
    $scope.app = appService.getApp();
    $scope.newPost;

    // some booleans to help track what we are editing, which tabs to enable, etc.
    // used in ng-show in appBuilderMenu

    PostService.getPosts(function (err) {
       if(!err) {
           $scope.posts = Posts.posts;
           if ($scope.posts.length > 10) { // change back to zero once posts filtered by app is done.
               $scope.postObj = $scope.posts[0];
           } else {
               $scope.postObj = angular.copy($scope.app);
               $scope.postObj.appId = $scope.postObj._id;
               $scope.postObj._id = null;
           }
       }
    });


    $scope.savePost = function (postToSave) {
        console.log(JSON.stringify(postToSave));
        if (postToSave._id !== null) {
            // Post already exists on server
            postToSave.put().then(function (res) {
                console.log('update');
                getPosts();
            }, function (err) {
                console.log(err.status);
            });
        } else {
            postApi.post(postToSave).then(function (res) {
                console.log(JSON.stringify(res));
                $scope.postObj = res;
                getPosts();
            }, function (err) {
                console.log(err.status);
            });
        }
    };

    $scope.newPost = function () {
        $scope.postObj = angular.copy($scope.app);
        $scope.postObj.appId = $scope.postObj._id;
        $scope.postObj._id = null;
    }

    $scope.viewPost = function (postIndex) {
        $scope.postObj = $scope.posts[postIndex];
    }

}])
;


