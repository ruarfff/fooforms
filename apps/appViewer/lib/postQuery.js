/*jslint node: true */
var Post = require('../models/post').Post;
var log = require(global.config.apps.LOGGING).LOG;

exports.getPostById = function (id, next) {
    "use strict";
    try {
        Post.findById(id, function (err, post) {
            next(err, post);
        });
    } catch (err) {
        log.error(err.toString());
        next(err, null);
    }
};

exports.getAllPosts = function (next) {
    "use strict";
    try {
        Post.find({}, function (err, post) {
            next(err, post);
        });
    } catch (err) {
        log.error(err.toString());
        next(err, null);
    }
};

exports.getUserPosts = function (userId, next) {
    "use strict";
    try {
        Post.find({ owner: userId }, function (err, posts) {
            next(err, posts);
        });
    } catch (err) {
        log.error(err.toString());
        next(err, null);
    }
};