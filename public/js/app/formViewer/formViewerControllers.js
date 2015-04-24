/* Controllers */

angular.module('formViewer')
    .controller('FormViewerCtrl', ['$scope', '$route', '$location', '$log', '$http', '$modal', 'Restangular', 'SweetAlert', 'Session', 'FormService', 'PostService', 'Posts', '_', '$timeout', '$window', 'statusFilterFilter',
        function ($scope, $route, $location, $log, $http, $modal, Restangular, SweetAlert, Session, FormService, PostService, Posts, _, $timeout, $window, statusFilterFilter) {
            "use strict";

            $scope.selectedStatus = [{fieldID: 'All', status: 'All'}];

            $scope.postView = 'feed';
            $scope.showPostForm = false;
            $scope.printPreview = false;
            $scope.tableRows = 10;
            $scope.feedPosition = {'top': '170px'};
            // Posts are linked to the post collection directive
            $scope.posts = [];
            // Need location to set correct url for Edit button
            $scope.location = $location.path();

            $scope.owner = $route.current.params.name;
            var org = _.find(Session.user.organisations, {displayName: $scope.owner});

            var team = _.find(Session.user.teams, {displayName: $route.current.params.team});

            var formName = $route.current.params.form;
            var folder;

            folderDetect: if (Session.user.displayName === $scope.owner) {
                folder = Session.user.defaultFolder;
            } else if (team) {
                folder = team.defaultFolder;
                break folderDetect;
            } else if (org) {
                folder = org.defaultFolder;
            } else {
                window.location.href = '/dashboard';
            }
            $scope.form = _.find(folder.forms, {displayName: formName});
            $scope.activeForm = $scope.form;
            if (!$scope.form) {
                window.location.href = '/dashboard';
            }

            //$scope.activePost = Posts.newPost($scope.form);

            $scope.postStreams = $scope.form.postStreams.join(',');

            $scope.showPostForm = false;

            $scope.doingPostApi = false;

            $scope.gridHeadings = [];

            $scope.createGridHeadings = function () {

                var map = _.pick($scope.form, 'fields');

                angular.forEach(map.fields, function (fieldData) {

                    if (fieldData.showInGrid === true) {
                        $scope.gridHeadings.push({id: fieldData.id, label: fieldData.label});

                    }
                });
            };

            $scope.createGridHeadings();

            $scope.newPost = function () {
                $scope.activePost = Posts.newPost(angular.copy($scope.form));
                $scope.showPostForm = true;
                $scope.setMessage('');
            };

            $scope.cancelPost = function () {
                $scope.showPostForm = false;
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
                $scope.doingPostApi = true;
                if ($scope.activePost._id) {

                    // Post already exists on server

                    // var postToSave = angular.copy($scope.activePost);
                    // This was causing mods to postToSave to not get sent to the server
                    // Something to do with restangular I expect.
                    // Removed angular.copy and does not seem to cause any issues.
                    // Brian

                    $scope.activePost.lastModified = new Date();
                    var postToSave = $scope.activePost;

                    delete postToSave.commentStreams;
                    PostService.updatePost(postToSave, function (err, post) {
                        $scope.doingPostApi = false;
                        if (err) {
                            $log.error(err);
                            SweetAlert.swal('Not Saved!', 'An error occurred trying to update your post.', 'error');
                        } else {
                            $log.debug(post);
                            $scope.activePost = post;

                            $scope.showPostForm = false;
                        }
                    });
                } else {
                    PostService.createPost($scope.activePost, function (err, post) {
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
                                    console.log(err);
                                } else {
                                    _.pull($scope.posts, $scope.activePost);
                                    $scope.activePost = Posts.newPost($scope.form);
                                    SweetAlert.swal('Deleted!', 'Your post has been deleted.', 'success');
                                }
                            });
                        });
                } else {
                    $scope.doingPostApi = false;
                    // Post was never saved
                    $scope.activePost = Posts.newPost($scope.form);
                }
                //Update the grid
                // $scope.posts2Grid();
            };

            $scope.viewPost = function (postIndex) {
                $scope.activePost = {};
                $scope.showPostForm = false;

                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.activePost = $scope.posts[postIndex];
                        $scope.showPostForm = true;
                        $scope.setMessage('');
                    });
                }, 0);
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


            //Grid Related
            $scope.setFeedHeight = function () {
                var feedHeader = angular.element('#feedHeader')[0];
                $scope.feedPosition = {'top': feedHeader.offsetHeight + feedHeader.offsetTop, opacity: '0.05'};
                $timeout(function () {

                    //var height = $window.innerHeight - (feedHeader.offsetHeight + feedHeader.offsetTop);

                    $scope.feedPosition = {'top': feedHeader.offsetHeight + feedHeader.offsetTop};

                    // Sort out the FooGrid
                    var fooGrid = angular.element('#fooGrid');

                    fooGrid[0].style.minWidth = feedHeader.offsetWidth;

                    var cellCount = fooGrid[0].rows[0].cells.length;
                 var rowCount = fooGrid[0].rows.length;
                    var lastRowIndex = rowCount - 1;

                    if (rowCount>1) {
                        // First Clear existing width settings
                        for (var i = 0; i < cellCount; i++) {
                            var th = fooGrid[0].rows[0].cells[i];
                            var firstRowTd = fooGrid[0].rows[1].cells[i];
                            th.style.width = '';
                            th.style.minWidth = '';
                            th.style.maxWidth = '';
                            firstRowTd.style.width = '';
                            firstRowTd.style.minWidth = '';
                            firstRowTd.style.maxWidth = '';
                        }

                        // Set minimum widths for td's based on width of th's
                        for (var i = 0; i < cellCount; i++) {
                            var th = fooGrid[0].rows[0].cells[i];
                            var firstRowTd = fooGrid[0].rows[1].cells[i];
                            firstRowTd.style.minWidth = th.offsetWidth + 'px';
                        }


                        // Now set th to value of last row td.width
                        for (var i = 0; i < cellCount; i++) {
                            var th = fooGrid[0].rows[0].cells[i];
                            var lastRowTd = fooGrid[0].rows[lastRowIndex].cells[i];
                            var firstRowTd = fooGrid[0].rows[1].cells[i];

                            if (lastRowTd.offsetWidth >= th.offsetWidth) {
                                th.style.width = lastRowTd.offsetWidth + 'px';
                                th.style.minWidth = lastRowTd.offsetWidth + 'px';
                                th.style.maxWidth = lastRowTd.offsetWidth + 'px';
                                firstRowTd.style.width = lastRowTd.offsetWidth + 'px';
                                firstRowTd.style.minWidth = lastRowTd.offsetWidth + 'px';
                                firstRowTd.style.maxWidth = lastRowTd.offsetWidth + 'px';
                            } else {
                                th.style.width = th.offsetWidth + 'px';
                                th.style.minWidth = th.offsetWidth + 'px';
                                th.style.maxWidth = th.offsetWidth + 'px';
                                firstRowTd.style.width = th.offsetWidth + 'px';
                                firstRowTd.style.minWidth = th.offsetWidth + 'px';
                                firstRowTd.style.maxWidth = th.offsetWidth + 'px';
                            }
                        }
                    }

                }, 500);


            };

            angular.element($window).bind('resize', function () {
                $scope.$apply(function () {
                    $scope.setFeedHeight();
                });
            });


            $scope.$watch('postView', function (value) {


                $scope.setFeedHeight();


            });


            $scope.filterStatus = function (status, field) {

                var hasAll = function () {
                    if (_.indexOf($scope.selectedStatus, {fieldID: 'All', status: 'All'}) > -1) {
                        return true
                    } else {
                        return false;
                    }
                };


                switch (status) {
                    case 'All':
                        $scope.selectedStatus = [{fieldID: 'All', status: 'All'}];
                        break;
                    default:
                        //filter selected so remove all
                        var allPos = _.findIndex($scope.selectedStatus, {fieldID: 'All', status: 'All'});
                        if (allPos > -1) {
                            $scope.selectedStatus.splice(allPos, 1);
                        }

                        var statusPos = _.findIndex($scope.selectedStatus, {fieldID: field.id, status: status});
                        if (statusPos === -1) {
                            $scope.selectedStatus.push({fieldID: field.id, status: status});
                        } else {
                            $scope.selectedStatus.splice(statusPos, 1);
                        }
                }
                // reset if empty
                if ($scope.selectedStatus.length === 0) {
                    $scope.selectedStatus = [{fieldID: 'All', status: 'All'}];
                }

                $scope.setFeedHeight();
            };

            $scope.isFilter = function (status, field) {
                var statusPos = _.where($scope.selectedStatus, {fieldID: field, status: status});
                if (statusPos.length === 0) {
                    return false;
                } else {
                    return true;
                }
            };

        }]);


