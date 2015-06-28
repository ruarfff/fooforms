(function () {
    'use strict';

    angular
        .module('fooforms.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$routeParams', '$log', '$timeout', '$window', '_', 'SweetAlert', 'Restangular', 'session', 'postService'];

    /* @ngInject */
    function DashboardController($scope, $routeParams, $log, $timeout, $window, _, SweetAlert, Restangular, session, postService) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = 'Dashboard';
        $scope.postView = 'feed';
        $scope.printPreview = false;
        $scope.fullScreen = false;
        $scope.deletingPostId = false;
        // Posts are linked to the post collection directive
        $scope.posts = [];


        // Public functions
        $scope.activate = activate;
        $scope.cancelPost = cancelPost;
        $scope.copyPost = copyPost;
        $scope.savePost = savePost;
        $scope.deletePost = deletePost;
        $scope.printPost = $window.print;
        $scope.showFullScreen = showFullScreen;
        $scope.cancelFullScreen = cancelFullScreen;
        $scope.setFeedHeight = setFeedHeight;

        activate(session);

        ////////////////

        function activate(session) {
            var postStreamsArray = [];
            var forms = [];
            var currentName = $routeParams.name;
            var currentTeam = $routeParams.team;

            // Check if this is a user dashboard. If not, it is an organisation or team dashboard
            if (!currentName || session.user.displayName === currentName) {
                $scope.organisation = session.user.organisations[0];
                forms = session.user.defaultFolder.forms;
                _.forEach(session.user.organisations, function (org) {
                    if (org.defaultFolder.forms && org.defaultFolder.forms.length > 0) {
                        forms = forms.concat(org.defaultFolder.forms);
                    }
                });
                _.forEach(session.user.teams, function (team) {
                    if (team.defaultFolder.forms && team.defaultFolder.forms.length > 0) {
                        forms = forms.concat(team.defaultFolder.forms);
                    }
                });
            }
            // It's a team dashboard
            else if (currentName && currentTeam) {
                $scope.team = _.find(session.user.teams, {displayName: currentTeam});
                if (!$scope.team) {
                    $window.location.href = '/dashboard';
                } else {
                    forms = $scope.team.defaultFolder.forms;
                }
            }
            // It's an org dashboard
            else {
                $scope.organisation = _.find(session.user.organisations, {displayName: currentName});
                if (!$scope.organisation) {
                    // If this happens nothing can be loaded so attempt to get a normal dashboard
                    $window.location.href = '/dashboard';
                } else {
                    forms = [];
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
                session.forms.push(form);
            });

            $scope.postStreams = postStreamsArray.join(',');

            angular.element($window).bind('resize', function () {
                $scope.$apply(function () {
                    $scope.setFeedHeight();
                });
            });

            $scope.$watch('postView', function () {
                $scope.setFeedHeight();
            });
        }

        function copyPost() {
            var newPost = angular.copy($scope.activePost);
            if (newPost._id) {
                delete newPost._id;
                delete newPost.createdBy;
            }
            $scope.activePost = newPost;
            $scope.activePost.lastModified = '';

            postService.createPost($scope.activePost, function (err, post) {
                $scope.doingPostApi = false;
                if (err) {
                    $log.error(err);
                    SweetAlert.swal('Not Saved!', 'Your post has not been created.', 'error');
                } else {
                    $scope.posts.unshift(post);
                    SweetAlert.swal('Copied', 'Your post has been copied and saved.', 'success');
                    $timeout(function () {
                        $scope.activePost = Restangular.copy(post);
                    });
                }
            });
        }


        function savePost() {
            $scope.doingPostApi = true;
            if ($scope.activePost._id) {
                // Post already exists on server
                $scope.activePost.lastModified = new Date();
                postService.updatePost($scope.activePost, function (err, post) {
                    $scope.doingPostApi = false;
                    if (err) {
                        $log.error(err);
                        SweetAlert.swal('Not Saved!', 'An error occurred trying to update your post.', 'error');
                    } else {
                        var postIndex = _.findIndex($scope.posts, function (i) {
                            return i._id === $scope.activePost._id
                        });

                        $scope.posts[postIndex] = Restangular.copy(post);

                        $scope.showPostForm = false;
                        $scope.activePost = false;
                        $timeout(function () {
                            $scope.activePost = Restangular.copy(post);
                        });
                    }
                });
            } else {
                postService.createPost($scope.activePost, function (err, post) {
                    $scope.doingPostApi = false;
                    if (err) {
                        $log.error(err);
                        SweetAlert.swal('Not Saved!', 'Your post has not been created.', 'error');
                    } else {
                        $scope.posts.unshift(post);
                        $scope.activePost = post;
                        $scope.showPostForm = false;
                    }
                });
            }
        }

        function cancelPost() {
            $scope.showPostForm = false;
        }

        function deletePost() {
            if ($scope.activePost._id) {
                SweetAlert.swal({
                        title: 'Are you sure?', text: 'Your will not be able to recover this post!',
                        type: 'warning',
                        showCancelButton: true, confirmButtonColor: '#DD6B55',
                        confirmButtonText: 'Yes, delete it!', closeOnConfirm: true
                    },
                    function () {
                        postService.deletePost($scope.activePost, function (err) {
                            $scope.deletingPostId = $scope.activePost._id;
                            $scope.doingPostApi = false;
                            if (err) {
                                SweetAlert.swal('Not Deleted!', 'An error occurred trying to delete your post.', 'error');
                                $log.error(err);
                                $scope.deletingPostId = false;
                            } else {

                                var postIndex = _.findIndex($scope.posts, function (i) {
                                    return i._id === $scope.activePost._id
                                });

                                $scope.showPostForm = false;
                                $scope.activePost = false;

                                $timeout(function () {

                                    $scope.posts.splice(postIndex, 1);
                                    $scope.deletingPostId = false;
                                    var postcount = $scope.posts.length;
                                    if (postIndex < postcount) {
                                        $scope.activePost = Restangular.copy($scope.posts[postIndex]);
                                    } else {
                                        $scope.activePost = Restangular.copy($scope.posts[postcount - 1]);
                                    }
                                }, 1500);

                            }
                        });
                    });
            } else {
                SweetAlert.swal('Not Deleted!', 'Post was never saved.', 'error');
                $scope.deletingPostId = false;
            }
        }

        function showFullScreen() {
            $scope.fullScreen = true;

        }

        function cancelFullScreen() {
            $scope.fullScreen = false;
        }

        function setFeedHeight() {
            var feedHeader = angular.element('#feedHeader')[0];
            var top = 150;
            $scope.feedPosition = {'top': top};

            $timeout(function () {
                var newTop = feedHeader.offsetHeight + feedHeader.offsetTop;
                if (top !== newTop) {
                    $scope.feedPosition = {'top': feedHeader.offsetHeight + feedHeader.offsetTop};
                }
            }, 500);
        }

    }

})();
