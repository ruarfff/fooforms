/* Controllers */

fooformsApp.controller('appViewerCtrl', ['$scope', '$http' , '$modal', 'Restangular', 'AppService', 'Apps', 'PostService', 'Posts', function ($scope, $http, $modal, Restangular, AppService, Apps, PostService, Posts) {
    "use strict";

    // the main object to store the app data
    $scope.app = Apps.getCurrentApp();
    $scope.posts = [];

    PostService.getAppPosts($scope.app, function (err) {
        if (!err) {
            $scope.posts = Posts.posts;
            if ($scope.posts.length > 0) { // change back to zero once posts filtered by app is done.
                $scope.postObj = $scope.posts[0];
            } else {
                $scope.postObj = Posts.newPost($scope.app);
            }

            if (Posts.activePost && Posts.activePost._id) {
                $scope.postObj = Posts.activePost;
            }
        }
    });

    $scope.newPost = function () {
        $scope.postObj = Posts.newPost($scope.app);
    };

    $scope.savePost = function (postToSave) {
        console.log(JSON.stringify(postToSave));
        if (postToSave._id) {
            // Post already exists on server
            PostService.updatePost(postToSave, function (err) {
                if (err) {
                    console.log(err.toString());
                } else {
                    $scope.posts = Posts.posts;
                    $scope.postObj = Posts.findById(postToSave._id);
                }
            });
        } else {
            PostService.createPost(postToSave, function (err, postId) {
                if (err) {
                    console.log(err.toString());
                } else {
                    $scope.posts = Posts.posts;
                    $scope.postObj = Posts.findById(postId);
                }
            });
        }
    };

    $scope.deletePost = function (postToDelete) {
        if (postToDelete._id) {
            PostService.deletePost(postToDelete, function (err) {
                if (err) {
                    console.log(err.toString());
                } else {
                    $scope.posts = Posts.posts;
                    $scope.postObj = Posts.newPost($scope.app);
                }
            });
        } else {
            // Post was never saved
            $scope.postObj = Posts.newPost($scope.app);
        }
    };

    $scope.viewPost = function (postIndex) {
        $scope.postObj = $scope.posts[postIndex];
    };

}]);


