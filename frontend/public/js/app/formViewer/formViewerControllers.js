/* Controllers */

angular.module('formViewer')
    .controller('FormViewerCtrl', ['$scope', '$route', '$location', '$log', '$http', '$modal', 'Restangular', 'SweetAlert', 'Session', 'FormService', 'PostService', 'Posts', '_',
        function ($scope, $route, $location, $log, $http, $modal, Restangular, SweetAlert, Session, FormService, PostService, Posts, _) {
            "use strict";

            $scope.selectedStatus = 'All';

            $scope.postView = 'feed';
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


            //Grid Related
            $scope.stGridHeight = function () {

                return {'height': (window.innerHeight - 170)}
            };

            $scope.posts2Grid = function () {
                $scope.gridData = [];
                var counter = 0;
                $scope.gridFields = [];
                angular.forEach($scope.posts, function (postEntry) {
                    var map = _.pick(postEntry, 'menuLabel', 'fields');
                    var entry = {};
                    entry['id'] = counter;
                    counter++;
                    angular.forEach(map.fields, function (field) {
                        if (field.showInGrid) {


                            var reduce = _.pick(field, 'label', 'value', 'type', 'selected', 'options');
                            var safeLabel = reduce.label.replace(/\s+/g, "_");

                            if (counter == 1) {
                                $scope.gridFields.push(safeLabel);

                            }
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
                                default:
                                    entry[safeLabel] = reduce.value;
                                    break;
                            }

                        }
                    });
                    $scope.gridData.push(entry);

                });

            };


            $scope.$watch('postView', function (value) {

                if ((typeof (value ) != 'undefined') && value == 'grid') {
                    $scope.posts2Grid();

                }


            });

            $scope.$watch('gridSelectedPost[0]', function (value) {

                if (typeof (value ) != 'undefined') {
                    $scope.showPostForm = true;
                    $scope.activePost = $scope.posts[value.id];

                }

            });

            $scope.filterStatus = function (status) {
                $scope.selectedStatus = status;
            };

        }]);


