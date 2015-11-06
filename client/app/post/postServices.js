angular.module('fooforms.post').factory('postService',
    ['$log', 'Restangular',
        function ($log, Restangular) {
            'use strict';
            Restangular.setDefaultRequestParams('get', {limit: 15});
            var postApi = Restangular.all('posts');
            return {
                getPostsByStreamList: function (args, next) {
                    var postStreams = args.postStreams;
                    var page = args.page || 1;
                    var pageSize = args.pageSize || 15;
                    if (!postStreams) {
                        return next(new Error('PostStreams are required to get posts'));
                    }
                    postApi.getList({postStreams: postStreams, page: page, pageSize: pageSize}).then(function (posts) {
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
                    if (typeof post.put !== 'function') {
                        post = Restangular.restangularizeElement(postApi, post, '');
                    }
                    post.put().then(function (res) {
                        return next(null, res);
                    }, function (err) {
                        $log.error(err);
                        return next(err);
                    });
                },
                deletePost: function (post, next) {
                    if (typeof post.remove !== 'function') {
                        post = Restangular.restangularizeElement(postApi, post, '');
                    }
                    post.remove().then(function () {
                        return next(null);
                    }, function (err) {
                        $log.error(err);
                        return next(err);
                    });
                }
            };
        }]);

angular.module('fooforms.post').service('post', function () {
    'use strict';
    this.activePost = {};
    this.newPost = function (form) {
        this.activePost = angular.copy(form);
        this.activePost.postStream = form.postStreams[0]._id || form.postStreams[0];
        if (this.activePost._id) {
            this.activePost.formId = this.activePost._id;
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
