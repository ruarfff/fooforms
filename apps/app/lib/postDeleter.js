/*jslint node: true */

var Post = require('../models/post').Post;
var App = require('../models/app').App;
var appErrors = require('./appErrors');
var log = require(global.config.apps.LOGGING).LOG;

exports.deletePostById = function (id, next) {
    "use strict";
    try {
        Post.findById(id, function (err, post) {
            if (err) return next(err, post);
            if (!post) return next(appErrors.postNotFoundError);

            post.remove(function (err, post) {
                if (err) next(err, post);
                Post.findById(post._id, function (err, postThatShouldBeNull) {
                    if (postThatShouldBeNull) return next(appErrors.postDeletionError);
                    App.findById(post.app, function (err, app) {
                        if (err) next(err, post);
                        if (!app) next(appErrors.appNotFoundError);
                        var index = app.posts.indexOf(post._id);
                        if (index > -1) {
                            app.posts.splice(index, 1);
                            app.save(function (err) {
                                next(err, postThatShouldBeNull);
                            });
                        } else {
                            return next(new Error('Post does not exist in app'), postThatShouldBeNull);
                        }
                    });
                });

            });

        });
    } catch (err) {
        log.error(err);
        next(err);
    }

};
