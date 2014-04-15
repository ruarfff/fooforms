/* global angular */

angular.module('form').factory('PostService', function ($log, Restangular, Posts) {
    'use strict';
    var postApi = Restangular.all('posts');
    return {
        createPost: function (post, next) {
            postApi.post(post).then(function (res) {
                Posts.addOne(res);
                next(null, res._id);
            }, function (err) {
                // TODO: Handle error
                $log.error(err.toString());
                next(err);
            });
        },
        updatePost: function (post, next) {
            post.put().then(function (res) {
                Posts.updateOne(post);
                next();
            }, function (err) {
                $log.error(err.toString());
                next(err);
            });
        },
        deletePost: function (post, next) {
            post.remove().then(function (res) {
                Posts.removeOne(post);
                next();
            }, function (err) {
                $log.error(err.toString());
                next(err);
            });
        },
        getUserPosts: function (next) {
            postApi.getList({ scope: 'user' }).then(function (posts) {
                Posts.updateAll(posts);
                next();
            }, function (err) {
                // TODO: Handle error
                $log.error(err.toString());
                next(err);
            });
        },
        getFolderPosts: function (folder, next) {
            postApi.getList({ scope: 'folder', id: folder._id }).then(function (posts) {
                Posts.updateAll(posts);
                next();
            }, function (err) {
                // TODO: Handle error
                $log.error(err.toString());
                next(err);
            });
        },
        getFormPosts: function (form, next) {
            postApi.getList({ scope: 'form', id: form._id }).then(function (posts) {
                Posts.updateAll(posts);
                next();
            }, function (err) {
                // TODO: Handle error
                $log.error(err.toString());
                next(err);
            });
        }
    };
});

angular.module('form').service('Posts', function () {
    'use strict';
    this.activePost = {};
    this.newPost = function (form) {
        this.activePost = angular.copy(form);
        this.activePost.form = form._id;
        this.activePost._id = null;
        return this.activePost;
    };

    this.setPost = function (newPost) {
        this.activePost = newPost;
        return this.activePost;
    };
    this.updateAll = function (posts) {
        this.posts = posts;
    };
    this.addOne = function (post) {
        this.posts.unshift(post);
    };
    this.updateOne = function (post) {
        var index;
        var count = this.posts.length;

        for (index = 0; index < count; index++) {
            if (this.posts[index]._id === post._id) {
                this.posts[index] = post;
            }
        }
        this.updateAll(this.posts);
    };
    this.removeOne = function (post) {
        var index;
        var count = this.posts.length;

        for (index = 0; index < count; index++) {
            if (this.posts[index]._id === post._id) {
                this.posts.splice(index, 1);
            }
        }
        this.updateAll(this.posts);
    };
    this.findById = function (id) {
        var index;
        var count = this.posts.length;

        for (index = 0; index < count; index++) {
            if (this.posts[index]._id === id) {
                return this.posts[index];
            }
        }
        return null;
    };

    return this;
});