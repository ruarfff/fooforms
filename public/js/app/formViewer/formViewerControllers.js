/* Controllers */

angular.module('formViewer')
    .controller('FormViewerCtrl', ['$scope', '$route', '$location', '$log', '$http', '$modal', 'Restangular', 'SweetAlert', 'Session', 'FormService', 'PostService', 'Posts', '_', '$timeout', '$window', 'statusFilterFilter',
        function ($scope, $route, $location, $log, $http, $modal, Restangular, SweetAlert, Session, FormService, PostService, Posts, _, $timeout, $window, statusFilterFilter) {
            "use strict";

            $scope.selectedStatus = [{fieldID: 'All', status: 'All'}];

            $scope.postView = 'list';
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

            if (!$scope.form) {
                window.location.href = '/dashboard';
            }

            $scope.activePost = Posts.newPost($scope.form);

            $scope.postStreams = $scope.form.postStreams.join(',');

            $scope.showPostForm = false;

            $scope.gridData = [1, 2, 3, 4, 5];
            $scope.gridSelectedPost = [];

            $scope.doingPostApi = false;

            $scope.newPost = function () {
                $scope.activePost = Posts.newPost(angular.copy($scope.form));
                $scope.showPostForm = true;
                $scope.setMessage('');
            };

            $scope.cancelPost = function () {

                $scope.gridSelectedPost = [];
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

                    // var postToSave = angular.copy($scope.activePost);
                    // This was causing mods to postToSave to not get sent to the server
                    // Something to do with restangular I expect.
                    // Removed angular.copy and does not seem to cause any issues.
                    // Brian
                    var postToSave = $scope.activePost;

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
                            $scope.activePost = Posts.newPost($scope.form);
                            SweetAlert.swal('Saved!', 'Your post has been created.', 'success');
                        }
                    });
                }
                //Update the grid
                $scope.posts2Grid();

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
                $scope.posts2Grid();
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

                $scope.feedPosition = {'opacity': 0};
                $timeout(function () {
                    var feedHeader = angular.element('#feedHeader')[0];
                    var height = $window.innerHeight - (feedHeader.offsetHeight + feedHeader.offsetTop);

                    $scope.tableRows = parseInt(height / 42);
                    $scope.feedPosition = {'top': feedHeader.offsetHeight + feedHeader.offsetTop};
                }, 500);


            };

            angular.element($window).bind('resize', function () {
                $scope.$apply(function () {
                    $scope.setFeedHeight();
                });
            });



            $scope.posts2Grid = function () {
                $scope.gridData = [];
                var counter = 0;
                var hasField = false;
                $scope.gridFields = [];

                var map = _.pick($scope.form, 'fields');

                angular.forEach(map.fields, function (fieldData) {


                    if (fieldData.showInGrid === true) {
                        var field = _.pick(fieldData, 'label', 'value', 'type', 'selected', 'options');
                        var safeLabel = field.label.replace(/\s+/g, "_");
                        $scope.gridFields.push(safeLabel);

                    }
                });

                angular.forEach(statusFilterFilter($scope.posts, $scope.selectedStatus), function (postEntry) {
                    hasField = false;
                    var map = _.pick(postEntry, 'menuLabel', 'fields');
                    var entry = {};
                    entry['id'] = postEntry._id;
                    counter++;
                    angular.forEach(map.fields, function (field) {


                        var reduce = _.pick(field, 'label', 'value', 'type', 'selected', 'options');
                        var safeLabel = reduce.label.replace(/\s+/g, "_");

                        if ($scope.gridFields.indexOf(safeLabel) > -1) {
                            hasField = true;
                            switch (reduce.type) {
                                case "radio":
                                case "status":
                                    entry[safeLabel] = reduce.selected;
                                    break;
                                case "textarea":
                                    entry[safeLabel] = reduce.value;
                                    break;
                                case "checkbox":
                                    var selectedOptions = "";
                                    for (var i = 0; i < reduce.options.length; i++) {
                                        if (reduce.options[i].selected) {
                                            selectedOptions += reduce.options[i].label + ": ";
                                        }
                                    }
                                    entry[safeLabel] = selectedOptions;
                                    break;
                                case "file":
                                    if (reduce.value.hasOwnProperty('originalName')) {
                                        entry[safeLabel] = reduce.value.originalName;
                                    }
                                    break;
                                default:
                                    entry[safeLabel] = reduce.value;
                                    break;
                            }

                        }
                    });
                    if (hasField) {
                        $scope.gridData.push(entry);
                    }

                });
            };


            $scope.$watch('postView', function (value) {

                if ((typeof (value ) != 'undefined') && value == 'grid') {
                    $scope.posts2Grid();

                }
                $scope.setFeedHeight();


            });

            $scope.$watch('gridSelectedPost[0]', function (value) {

                if (typeof (value ) != 'undefined') {
                    $scope.showPostForm = true;
                    var postIndex = _.findIndex($scope.posts, {'_id': value.id});
                    if (postIndex > -1) {
                        $scope.activePost = $scope.posts[postIndex];
                    } else {
                        alert("Could not find the post? Please reload the page and try again");
                    }

                }

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
                if ($scope.postView == 'grid') {
                    $scope.posts2Grid();

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


