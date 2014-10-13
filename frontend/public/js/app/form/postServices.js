/* global angular */

angular.module('form').factory('PostService',
    ['$log', 'Restangular', 'Posts',
        function ($log, Restangular, Posts) {
            'use strict';
            var postApi = Restangular.all('posts');
            return {
                getPostsByStream: function (args, next) {
                    var postStream = args.postStream;
                    var page = args.page || 1;
                    var pageSize = args.pageSize || 10;
                    if (!postStream) {
                        $log.error(err);
                        return next(new Error('PostStream is required to get posts'));
                    }
                    return postApi.getList({postStream: postStream, page: page, pageSize: pageSize}).then(function (posts) {
                        return next(null, posts);
                    }, function (err) {
                        $log.error(err);
                        return next(err);
                    });
                },
                createPost: function (post, next) {
                    postApi.post(post).then(function (res) {
                        return next(null, res);
                    }, function (err) {
                        $log.error(err);
                        return next(err);
                    });
                },
                updatePost: function (post, next) {
                    post.put().then(function (res) {
                        return next(null, res);
                    }, function (err) {
                        $log.error(err);
                        return next(err);
                    });
                },
                deletePost: function (post, next) {
                    post.remove().then(function () {
                        return next(null);
                    }, function (err) {
                        $log.error(err);
                        return next(err);
                    });
                }
            };
        }]);

angular.module('form').service('Posts', function () {
    'use strict';
    this.activePost = {};
    this.newPost = function (form) {
        this.activePost = angular.copy(form);
        this.activePost.postStream = form.postStreams[0]._id || form.postStreams[0];
        if (this.activePost._id) {
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
