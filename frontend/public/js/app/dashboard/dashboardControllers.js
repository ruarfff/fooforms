/* global angular */

angular.module('dashboard').controller('DashboardCtrl', ['$rootScope', '$scope', '$log', '$location', '$http' , '$modal', 'Restangular', 'DashboardService', 'AUTH_EVENTS', 'Session', function ($rootScope, $scope, $log, $location, $http, $modal, Restangular, DashboardService, AUTH_EVENTS, Session) {
    'use strict';


    // the main object to store the form data
    /**$scope.form = Forms.getCurrentForm();
     $scope.posts = [];
     $scope.postView = 'list';
     $scope.currentPostIndex = 0;
     $scope.doingPostApi = false;


     $scope.updateForm = function (form) {
        Forms.setCurrentForm(form);
        Posts.activePost = null;
    };

     $scope.updateFolder = function (folder) {
        Folders.setCurrentFolder(folder);

    };

     $scope.viewPost = function (post, index) {
        if (post) {
            var form = Forms.findById(post.form);
            $scope.posts.activePost = angular.copy(post);


            $scope.currentPostIndex = index;

            $scope.showPostForm = true;
            //$scope.setMessage('');


        }

    };


     $scope.savePost = function (postToSave) {
        $scope.doingPostApi = true;
        if (postToSave._id) {
            // Post already exists on server
            PostService.updatePost(postToSave, function (err) {
                if (err) {
                    console.log(err.toString());
                    $scope.setMessage('formViewer','alert-danger','','Something went wrong. It didn\'t save. Please try again..');
                } else {
                    $scope.posts = Posts.posts;
                    $scope.posts.activePost  = Posts.findById(postToSave._id);

                }
                $scope.doingPostApi = false;
            });
        }


    };

     $scope.deletePost = function (postToDelete) {
        $scope.doingPostApi = true;
        if (postToDelete._id) {
            PostService.deletePost(postToDelete, function (err) {
                if (err) {
                    console.log(err.toString());
                } else {
                    $scope.posts = Posts.posts;
                    $scope.viewPost($scope.posts[$scope.currentPostIndex]);
                    $scope.setMessage('formViewer','alert-danger','','Post deleted.!');
                }
                $scope.doingPostApi = false;
            });
        } else {
            // Post was never saved
            $scope.postObj = Posts.newPost($scope.form);
        }

    };
     $scope.postComment = function (comment) {
        try {
            if (comment.content) {
                comment.post = $scope.posts.activePost._id;
                $http.post(
                    '/api/comment',
                    comment
                ).success(function (data) {
                        $scope.posts.activePost.comments.push(data);
                        console.log(data);
                    }).
                    error(function (err) {
                        console.log(err);
                    });
            } else {
                alert('no content');
            }
        } catch (err) {
            console.log(err);
        }
    };

     FolderService.getFolders(function (err) {
        if (!err) {
            $scope.privateFolders = Folders.privateFolders;
            $scope.publicFolders = Folders.publicFolders;
        }
    });
     PostService.getUserPosts(function (err) {
        if (!err) {
            $scope.posts = Posts.posts;
            $scope.viewPost($scope.posts[0]);

        }
    });
     FormService.getUserForms(function (err) {
        if (!err) {
            $scope.forms = Forms.forms;
        }
    });*/

}]);
