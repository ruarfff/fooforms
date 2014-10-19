/* global angular */

angular.module('dashboard').controller('DashboardCtrl', ['$rootScope', '$scope', '$routeParams', '$log', '_', 'SweetAlert', 'DashboardService', 'Session', 'PostService',
    function ($rootScope, $scope, $routeParams, $log, _, SweetAlert, DashboardService, Session, PostService) {
        'use strict';
        $scope.postView = 'feed';

        // Posts are linked to the post collection directive
        $scope.posts = [];

        var postStreamsArray = [];
        var forms = [];


        var currentName = $routeParams.name;

        // Check if this is a user dashboard. If not, it is an organisation dashboard
        if(!currentName || Session.user.displayName === currentName) {
            $scope.organisation = Session.user.organisations[0];
            _.each(Session.user.organisations, function (org) {
                forms = forms.concat(org.defaultFolder.forms);
            });

            forms = Session.user.defaultFolder.forms.concat(forms);
        } else {
            $scope.organisation = _.find(Session.user.organisations, {displayName: currentName});
            forms = $scope.organisation.defaultFolder.forms;

            if(!$scope.organisation) {
                // If this happens nothing can be loaded so attempt to get a normal dashboard
                window.location.href = '/dashboard';
            }
        }

        // The organisation members is a special team but add to teams array for display purposes.
        $scope.organisation.teams.unshift($scope.organisation.members);

        _.each(forms, function (form) {
            postStreamsArray = postStreamsArray.concat(form.postStreams);

        });

        $scope.postStreams = postStreamsArray.join(',');
        $scope.activePost = {};


        $scope.cancelPost = function () {

        };
        $scope.copyPost = function () {
            var newPost = angular.copy($scope.activePost);
            if (newPost._id) {
                delete newPost._id;
            }
            $scope.activePost = newPost;
            SweetAlert.swal('Post Copied');

        };
        $scope.savePost = function () {
            if ($scope.activePost._id) {
                // Post already exists on server
                var postToSave = angular.copy($scope.activePost);
                delete postToSave.commentStreams;
                PostService.updatePost(postToSave, function (err, post) {
                    if (err) {
                        $log.error(err);
                        SweetAlert.swal('Not Saved!', 'An error occurred trying to update your post.', 'error');
                    } else {
                        $log.debug(post);
                        $scope.activePost = post;
                        SweetAlert.swal('Saved!', 'Your post has been saved.', 'success');

                    }
                });
            } else {
                PostService.createPost($scope.activePost, function (err, post) {
                    if (err) {
                        $log.error(err);
                        SweetAlert.swal('Not Saved!', 'Your post has not been created.', 'error');
                    } else {
                        $scope.posts.unshift(post);
                        $scope.activePost = post;
                        SweetAlert.swal('Saved!', 'Your post has been created.', 'success');
                    }
                });
            }

        };

        $scope.deletePost = function () {
            if ($scope.activePost._id) {
                SweetAlert.swal({   title: 'Are you sure?', text: 'Your will not be able to recover this post!',
                        type: 'warning',
                        showCancelButton: true, confirmButtonColor: '#DD6B55',
                        confirmButtonText: 'Yes, delete it!', closeOnConfirm: false },
                    function () {
                        PostService.deletePost($scope.activePost, function (err) {
                            $scope.doingPostApi = false;
                            if (err) {
                                SweetAlert.swal('Not Deleted!', 'An error occurred trying to delete your post.', 'error');
                                $log.error(err);
                            } else {
                                _.pull($scope.posts, $scope.activePost);
                                $scope.activePost = $scope.posts[0];
                                SweetAlert.swal('Deleted!', 'Your post has been deleted.', 'success');
                            }
                        });
                    });
            } else {
                SweetAlert.swal('Not Deleted!', 'Post was never saved.', 'error');
            }
        };


        /**
         *
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
