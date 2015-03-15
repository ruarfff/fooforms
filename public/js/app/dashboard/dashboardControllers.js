/* global angular */

angular.module('dashboard').controller('DashboardCtrl', ['$rootScope', '$scope', '$routeParams', '$log', '_', 'SweetAlert', 'DashboardService', 'Session', 'PostService', 'Posts', '$timeout','$window',
    function ($rootScope, $scope, $routeParams, $log, _, SweetAlert, DashboardService, Session, PostService, Posts, $timeout, $window) {
        'use strict';
        $scope.postView = 'list';
        $scope.printPreview = false;
        $scope.fullScreen = false;

        // Posts are linked to the post collection directive
        $scope.posts = [];

        var postStreamsArray = [];
        var forms = [];


        var currentName = $routeParams.name;
        var currentTeam = $routeParams.team;

        // Check if this is a user dashboard. If not, it is an organisation or team dashboard
        if (!currentName || Session.user.displayName === currentName) {
            $scope.organisation = Session.user.organisations[0];
            forms = Session.user.defaultFolder.forms;
            _.forEach(Session.user.organisations, function (org) {
                if (org.defaultFolder.forms && org.defaultFolder.forms.length > 0) {
                    forms = forms.concat(org.defaultFolder.forms);
                }
            });
            _.forEach(Session.user.teams, function (team) {
                if (team.defaultFolder.forms && team.defaultFolder.forms.length > 0) {
                    forms = forms.concat(team.defaultFolder.forms);
                }
            });
        }
        // It's a team dashboard
        else if (currentName && currentTeam) {
            $scope.team = _.find(Session.user.teams, {displayName: currentTeam});
            if (!$scope.team) {
                window.location.href = '/dashboard';
            } else {
                forms = $scope.team.defaultFolder.forms;
            }
        }
        // It's an org dashboard
        else {
            $scope.organisation = _.find(Session.user.organisations, {displayName: currentName});
            if (!$scope.organisation) {
                // If this happens nothing can be loaded so attempt to get a normal dashboard
                window.location.href = '/dashboard';
            } else {
                forms = $scope.organisation.defaultFolder.forms;
                _.forEach($scope.organisation.teams, function (team) {
                    if (team.defaultFolder.forms && team.defaultFolder.forms.length > 0) {
                        forms = forms.concat(team.defaultFolder.forms);
                    }
                });
            }
        }

        _.forEach(forms, function (form) {
            if (form)
                postStreamsArray = postStreamsArray.concat(form.postStreams);
                Session.forms.push(form);
        });

        $scope.postStreams = postStreamsArray.join(',');
        if (forms.length > 0) {
            $scope.activePost = Posts.newPost(forms[0]);
            $scope.activeForm = forms[0];
        }

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
                SweetAlert.swal({
                        title: 'Are you sure?', text: 'Your will not be able to recover this post!',
                        type: 'warning',
                        showCancelButton: true, confirmButtonColor: '#DD6B55',
                        confirmButtonText: 'Yes, delete it!', closeOnConfirm: false
                    },
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

        $scope.printPost = function () {

            window.print();

        };

        $scope.showFullScreen = function () {
            $scope.fullScreen = true;

        };
        $scope.cancelFullScreen = function () {
            $scope.fullScreen = false;
        };

        $scope.setFeedHeight = function () {

            $scope.feedPosition = {'opacity': 0  };
            $timeout(function(){
                var feedHeader = angular.element('#feedHeader')[0];
                var height=$window.innerHeight - (feedHeader.offsetHeight + feedHeader.offsetTop);

                $scope.tableRows=parseInt(height/42);
                $scope.feedPosition = {'top': feedHeader.offsetHeight+feedHeader.offsetTop };
            },500);


        };

        angular.element($window).bind('resize', function() {
            $scope.$apply(function() {
                $scope.setFeedHeight();
            });
        });

        $scope.$watch('postView', function (value) {

            $scope.setFeedHeight();


        });

    }]);
