/* Controllers */

fooformsApp.controller('appViewerCtrl', ['$scope', '$http' , '$modal', 'Restangular', 'AppService', 'Apps', 'PostService', 'Posts', function ($scope, $http, $modal, Restangular, AppService, Apps, PostService, Posts) {
    "use strict";

    // the main object to store the app data
    $scope.app = Apps.getCurrentApp();
    $scope.newPost;


    PostService.getAppPosts(function (err) {
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
        if (postToSave._id) {
            // Post already exists on server
            PostService.updatePost(postToSave, function(err) {
                if(err) {
                    console.log(err.toString());
                } else {
                    $scope.postObj = Posts.findById(postToSave._id);
                }
            });
        } else {
            PostService.createPost(postToSave, function (err, postId) {
                if(err) {
                    console.log(err.toString());
                } else {
                    $scope.postObj = Posts.findById(postId);
                }
            });
        }
    };

    $scope.deletePost = function(postToDelete) {
        if(postToDelete._id) {
            PostService.deletePost(postToDelete, function (err) {
                if(err) {
                    console.log(err.toString());
                } else {
                    $scope.postObj = Apps.newPost();
                }
            });
        } else {
            // Post was never saved
            $scope.postObj = Apps.newPost();
        }
    };

    $scope.newPost = Apps.newPost();

    $scope.viewPost = function (postIndex) {
        $scope.postObj = $scope.posts[postIndex];
    }

}])
;


