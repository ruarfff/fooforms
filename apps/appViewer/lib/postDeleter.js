/*jslint node: true */

var Post = require('../models/post').Post;
var log = require(global.config.apps.LOGGING).LOG;

exports.deletePostById = function (id, next) {
    "use strict";
    try {
        Post.findById(id, function (err, post) {
            if (err) {
                next(err, post);
            } else {
                post.remove(function (err, post) {
                    if (err) {
                        next(err, post);
                    } else {
                        Post.findById(post._id, function (err, postThatShouldBeNull) {
                            if (postThatShouldBeNull) {
                                err.code = 500;
                                err.data = 'Error deleting post';
                            }
                            next(err, postThatShouldBeNull);
                        });
                    }
                });
            }
        });
    } catch (err) {
        log.error(err.toString());
        next(err, null);
    }

};
