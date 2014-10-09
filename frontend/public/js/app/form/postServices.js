/* global angular */

angular.module('form').factory('PostService',
    ['$log', 'Restangular', 'Posts',
        function ($log, Restangular, Posts) {
            'use strict';
            var postApi = Restangular.all('posts');
            return {
                getPostsByStream: function (postStream, next) {
                    return postApi.getList({postStream: postStream}).then(function (posts) {
                        $log.info(posts);
                        next(null, posts);
                    });
                },
                createPost: function (post, next) {
                    postApi.post(post).then(function (res) {
                        next(null, res);
                    }, function (err) {
                        $log.error(err);
                        next(err);
                    });
                },
                updatePost: function (post, next) {
                    post.put().then(function (res) {
                        next(null, res);
                    }, function (err) {
                        $log.error(err);
                        next(err);
                    });
                },
                deletePost: function (post, next) {
                    post.remove().then(function () {
                        next(null);
                    }, function (err) {
                        $log.error(err);
                        next(err);
                    });
                }
            };
        }]);

angular.module('form').service('Posts', function () {
    'use strict';
    this.activePost = {};
    this.newPost = function (form) {
        this.activePost = form;
        this.activePost.postStream = form.postStreams[0]._id || form.postStreams[0];
        if(this.activePost._id) {
            delete this.activePost._id;
        }
        return this.activePost;
    };

    this.setPost = function (newPost) {
        this.activePost = newPost;
        return this.activePost;
    };

    return this;
});
