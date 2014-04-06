/*jslint node: true */

var App = require('../models/app').App;
var log = require(global.config.apps.LOGGING).LOG;
var async = require("async");

exports.deleteAppById = function (id, next) {
    "use strict";
    try {
        App.findById(id).populate('posts').exec(function (err, appToDelete) {
            if (err) {
                next(err, appToDelete);
            } else {
                var appPosts = appToDelete.posts;
                appToDelete.remove(function (err, app) {
                    if (err) {
                        return next(err, app);
                    }
                    App.findById(app._id, function (err, appThatShouldBeNull) {
                        if (appThatShouldBeNull) {
                            var appDeletionError = new Error('Error deleting app');
                            appDeletionError.http_code = 500;
                            log.error(appDeletionError);
                            return next(appDeletionError);
                        }
                        if (err) {
                            log.error(err);
                            return next(err);
                        }
                        if (appPosts && appPosts.length > 0) {
                            async.each(appPosts,
                                function (post, done) {
                                    post.remove(function (err) {
                                        if (err) {
                                            log.error(err);
                                        }
                                        return done();
                                    });
                                },
                                function (err) {
                                    next(err, appThatShouldBeNull);
                                }
                            );
                        }
                    });
                });
            }
        });
    } catch (err) {
        log.error(err);
        next(err);
    }
};
