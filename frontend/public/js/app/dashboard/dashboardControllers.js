/* global angular */

angular.module('dashboard').controller('DashboardCtrl', ['$scope', '$location', '$http' , '$modal', 'Restangular', 'FormService', 'Forms', 'FolderService', 'Folders', 'PostService', 'Posts', '_', function ($scope, $location, $http, $modal, Restangular, FormService, Forms, FolderService, Folders, PostService, Posts, _) {
    'use strict';
    // the main object to store the form data
    $scope.form = Forms.getCurrentForm();
    $scope.posts = [];
    $scope.postView = 'list';


    $scope.updateForm = function (form) {
        Forms.setCurrentForm(form);
        Posts.activePost = null;
    };

    $scope.updateFolder = function (folder) {
        Folders.setCurrentFolder(folder);

    };

    $scope.viewPost = function (post) {
        if (post) {
            var form = Forms.findById(post.form);
            $scope.posts.activePost = post;
            //Forms.setCurrentForm(form);

            //$scope.postObj = $scope.posts[postIndex];
            $scope.showPostForm = true;
            //$scope.setMessage('');

            // $location.path($scope.user.displayName + '/MyPrivateFolder/' + form.name);
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
    });

}]);
