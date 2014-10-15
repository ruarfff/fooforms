/* Controllers */

angular.module('formViewer')
    .controller('FormViewerCtrl', ['$scope', '$route', '$log', '$http' , '$modal', 'Restangular', 'SweetAlert', 'Session', 'FormService', 'PostService', 'Posts', '_',
        function ($scope, $route, $log, $http, $modal, Restangular, SweetAlert, Session, FormService, PostService, Posts, _) {
            "use strict";

            $scope.postView = 'feed';
            // Posts are linked to the post collection directive
            $scope.posts = [];

            $scope.owner = $route.current.params.name;
            var org = _.find(Session.user.organisations, {displayName: $scope.owner});
            var formName = $route.current.params.form;
            var folder;

            if (Session.user.displayName === $scope.owner) {
                folder = Session.user.defaultFolder;
            } else if (org) {
                folder = org.defaultFolder;
            } else {
                window.location.href = '/dashboard';
            }
            $scope.form = _.find(folder.forms, {displayName: formName});
            $scope.activePost = Posts.newPost($scope.form);

            $scope.postStreams = $scope.form.postStreams.join(',');

            $scope.showPostForm = false;

            $scope.gridData = [];
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
                    SweetAlert.swal({   title: 'Are you sure?', text: 'Your will not be able to recover this post!',
                            type: 'warning',
                            showCancelButton: true, confirmButtonColor: '#DD6B55',
                            confirmButtonText: 'Yes, delete it!', closeOnConfirm: false },
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


            $scope.addRepeat = function (groupBox, field) {
                var repeater = {};
                repeater.id = new Date().getTime();
                repeater.fields = angular.copy($scope.activePost.fields[groupBox].fields);

                // need to swap out the field.id's for new ones.
                var fieldCount = repeater.fields.length;

                for (var fieldIndex = 0; fieldIndex < fieldCount; fieldIndex++) {
                    var fieldId = repeater.fields[fieldIndex].id
                    repeater.fields[fieldIndex].id = repeater.id + '_' + fieldId;

                    // Fields specified in calculation need filedIds updated
                    if (repeater.fields[fieldIndex].type == 'calculation') {

                        if (repeater.fields[fieldIndex].options.field1.item != 'Specified Value') {
                            var fieldItem = repeater.fields[fieldIndex].options.field1.item;
                            repeater.fields[fieldIndex].options.field1.item = repeater.id + '_' + fieldItem;
                        }
                        if (repeater.fields[fieldIndex].options.field2.item != 'Specified Value') {
                            var fieldItem = repeater.fields[fieldIndex].options.field2.item;
                            repeater.fields[fieldIndex].options.field2.item = repeater.id + '_' + fieldItem;
                        }
                    }
                }

                $scope.activePost.fields[groupBox].repeaters.push(repeater);

            };
            $scope.removeRepeat = function (groupBox, field) {

            };


            //Grid Related
            $scope.stGridHeight = function () {

                return{'height': (window.innerHeight - 170)}
            };

            $scope.posts2Grid = function () {
                $scope.gridData = [];
                var counter = 0;
                angular.forEach($scope.posts, function (postEntry) {
                    var map = _.pick(postEntry, 'menuLabel', 'fields');
                    var entry = {};
                    entry['id'] = counter;
                    counter++;
                    angular.forEach(map.fields, function (field) {


                        var reduce = _.pick(field, 'label', 'value', 'type', 'selected', 'options');
                        var safeLabel = reduce.label.replace(/\s+/g, "_");

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


                    });
                    $scope.gridData.push(entry);

                });
            };

            $scope.$watch('gridSelectedPost[0]', function (value) {

                if (typeof (value ) != 'undefined') {
                    $scope.activePost = $scope.posts[value.id];

                }

            });

            $scope.filterStatus = function (option) {
                $scope.posts.forEach(function (post) {
                    // TODO: filtering of some sort
                    post.hide = false;
                });
            };

            $scope.filterStatusOff = function () {
                $scope.posts.forEach(function (post) {
                    post.hide = false;
                });

            };


        }]);


