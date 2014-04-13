/*jslint node: true */

var Form = require('../models/form').Form;
var log = require(global.config.modules.LOGGING).LOG;
var async = require("async");

exports.deleteFormById = function (id, next) {
    "use strict";
    try {
        Form.findById(id).populate('posts').exec(function (err, formToDelete) {
            if (err) {
                return next(err, formToDelete);
            } else {
                var formPosts = formToDelete.posts;
                formToDelete.remove(function (err, form) {
                    if (err) {
                        log.error(__filename, ' - ', err);
                        return next(err, form);
                    }
                    Form.findById(form._id, function (err, formThatShouldBeNull) {
                        if (formThatShouldBeNull && !err) {
                            err = new Error('Error deleting form');
                            err.http_code = 500;
                        }
                        if (err) {
                            log.error(__filename, ' - ', err);
                            return next(err);
                        }
                        if (formPosts && formPosts.length > 0) {
                            async.each(formPosts,
                                function (post, done) {
                                    post.remove(function (err) {
                                        if (err) {
                                            log.error(__filename, ' - ', err);
                                        }
                                        return done();
                                    });
                                },
                                function (err) {
                                    next(err);
                                }
                            );
                        } else {
                            next();
                        }
                    });
                });
            }
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};
