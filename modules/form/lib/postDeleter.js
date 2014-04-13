/*jslint node: true */

var Post = require('../models/post').Post;
var Form = require('../models/form').Form;
var formErrors = require('./formErrors');
var log = require(global.config.modules.LOGGING).LOG;

exports.deletePostById = function (id, next) {
    "use strict";
    try {
        Post.findById(id, function (err, post) {
            if (err) {
                return next(err, post);
            }
            if (!post) {
                return next(formErrors.postNotFoundError);
            }

            post.remove(function (err, post) {
                if (err) {
                    return next(err, post);
                }
                Post.findById(post._id, function (err, postThatShouldBeNull) {
                    if (postThatShouldBeNull) return next(formErrors.postDeletionError);
                    Form.findById(post.form, function (err, form) {
                        if (err) {
                            return next(err, post);
                        }
                        if (!form) {
                            return next(formErrors.formNotFoundError);
                        }
                        var index = form.posts.indexOf(post._id);
                        if (index > -1) {
                            form.posts.pull(post._id);
                            form.save(function (err) {
                                return next(err, postThatShouldBeNull);
                            });
                        } else {
                            return next(new Error('Post does not exist in form'), postThatShouldBeNull);
                        }
                    });
                });

            });

        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }

};
