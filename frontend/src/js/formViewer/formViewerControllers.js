/* Controllers */

fooformsApp.controller('FormViewerCtrl', ['$scope', '$http' , '$modal', 'Restangular', 'FormService', 'Forms', 'PostService', 'Posts', function ($scope, $http, $modal, Restangular, FormService, Forms, PostService, Posts) {
    "use strict";

    // the main object to store the form data
    $scope.form = Forms.getCurrentForm();
    $scope.posts = [];
    $scope.showPostForm=false;

    PostService.getFormPosts($scope.form, function (err) {
        if (!err) {
            $scope.posts = Posts.posts;
        }
        if (Posts.activePost && Posts.activePost._id) {
            $scope.postObj = Posts.activePost;
        } else {
            $scope.postObj = Posts.newPost($scope.form);
        }
        $scope.showPostForm=false;
        $scope.setMessage('');

    });

    $scope.newPost = function () {
        $scope.postObj = Posts.newPost($scope.form);
        $scope.showPostForm=true;
        $scope.setMessage('');
    };

    $scope.savePost = function (postToSave) {
        if (postToSave._id) {
            // Post already exists on server
            PostService.updatePost(postToSave, function (err) {
                if (err) {
                    console.log(err.toString());
                    $scope.setMessage('formViewer','alert-danger','','Something went wrong. It didn\'t save. Please try again..');
                } else {
                    $scope.posts = Posts.posts;
                    $scope.postObj = Posts.findById(postToSave._id);
                    $scope.setMessage('formViewer','alert-success','','All saved....nice one');

                }
            });
        } else {
            PostService.createPost(postToSave, function (err, postId) {
                if (err) {
                    console.log(err.toString());
                    $scope.setMessage('formViewer','alert-danger','','Something went wrong. It didn\'t save. Please try again..');
                } else {
                    $scope.posts = Posts.posts;
                    $scope.postObj = Posts.findById(postId);
                    $scope.setMessage('formViewer','alert-success','','New post, created and saved!');
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
                    $scope.postObj = Posts.newPost($scope.form);
                    $scope.setMessage('formViewer','alert-danger','','Post deleted.!');
                }
            });
        } else {
            // Post was never saved
            $scope.postObj = Posts.newPost($scope.form);
        }
    };

    $scope.viewPost = function (postIndex) {
        $scope.postObj = $scope.posts[postIndex];
        $scope.showPostForm = true;
        $scope.setMessage('');

    };

}]);


