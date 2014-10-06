/* Controllers */

angular.module('formViewer')
    .controller('FormViewerCtrl', ['$scope', '$route', '$http' , '$modal', 'Restangular', 'FormService', 'Forms', 'PostService', 'Posts', function ($scope, $route, $http, $modal, Restangular, FormService, Forms, PostService, Posts) {
        "use strict";

        var owner = $route.current.params.formOwner;
        var form = $route.current.params.form;

        // the main object to store the form data
        $scope.form = Forms.getCurrentForm();
        $scope.posts = [];
        $scope.showPostForm = false;
        $scope.postView = 'feed';

        $scope.gridData = [];
        $scope.gridSelectedPost = [];


        PostService.getFormPosts($scope.form, function (err) {
            if (!err) {
                $scope.posts = Posts.posts;
            }
            if (Posts.activePost && Posts.activePost._id) {
                $scope.postObj = Posts.activePost;
            } else {

                if ($scope.posts.length > 0) {
                    // Open the first post
                    $scope.viewPost(0);
                } else {
                    // Create a New Post
                    $scope.postObj = Posts.newPost($scope.form);
                }

            }
            $scope.showPostForm = false;
            $scope.setMessage('');
            $scope.posts2Grid();

        });

        $scope.newPost = function () {
            $scope.postObj = Posts.newPost($scope.form);
            $scope.showPostForm = true;
            $scope.setMessage('');
        };

        $scope.savePost = function (postToSave) {
            if (postToSave._id) {
                // Post already exists on server
                PostService.updatePost(postToSave, function (err) {
                    if (err) {
                        console.log(err.toString());
                        $scope.setMessage('formViewer', 'alert-danger', '', 'Something went wrong. It didn\'t save. Please try again..');
                    } else {
                        $scope.posts = Posts.posts;
                        $scope.postObj = Posts.findById(postToSave._id);
                        $scope.setMessage('formViewer', 'alert-success', '', 'All saved....nice one');

                    }
                });
            } else {
                PostService.createPost(postToSave, function (err, postId) {
                    if (err) {
                        console.log(err.toString());
                        $scope.setMessage('formViewer', 'alert-danger', '', 'Something went wrong. It didn\'t save. Please try again..');
                    } else {
                        $scope.posts = Posts.posts;
                        $scope.postObj = Posts.findById(postId);
                        $scope.setMessage('formViewer', 'alert-success', '', 'New post, created and saved!');
                    }
                });
            }
            //Update the grid
            $scope.posts2Grid();

        };

        $scope.deletePost = function (postToDelete) {
            if (postToDelete._id) {
                PostService.deletePost(postToDelete, function (err) {
                    if (err) {
                        console.log(err.toString());
                    } else {
                        $scope.posts = Posts.posts;
                        $scope.postObj = Posts.newPost($scope.form);
                        $scope.setMessage('formViewer', 'alert-danger', '', 'Post deleted.!');
                    }
                });
            } else {
                // Post was never saved
                $scope.postObj = Posts.newPost($scope.form);
            }
            //Update the grid
            $scope.posts2Grid();
        };

        $scope.viewPost = function (postIndex) {
            $scope.postObj = {};
            $scope.showPostForm = false;

            setTimeout(function () {
                $scope.$apply(function () {
                    $scope.postObj = $scope.posts[postIndex];
                    $scope.showPostForm = true;
                    $scope.setMessage('');
                });

            }, 0);


        };


        $scope.addRepeat = function (groupBox, field) {
            var repeater = {};
            repeater.id = new Date().getTime();
            repeater.fields = angular.copy($scope.postObj.fields[groupBox].fields);

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


            $scope.postObj.fields[groupBox].repeaters.push(repeater);

        }
        $scope.removeRepeat = function (groupBox, field) {

        }


        //Grid Related
        $scope.stGridHeight = function () {

            return{'height': (window.innerHeight - 170)}
        }

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
                $scope.postObj = $scope.posts[value.id];

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


