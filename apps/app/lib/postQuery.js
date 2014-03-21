/*jslint node: true */
var Post = require('../models/post').Post;
var log = require(global.config.apps.LOGGING).LOG;

exports.getPostById = function (id, next) {
    "use strict";
    try {
        Post.findById(id, next);
    } catch (err) {
        log.error(err);
        next(err);
    }
};

exports.getAllPosts = function (next) {
    "use strict";
    try {
        Post.find({}, next);
    } catch (err) {
        log.error(err);
        next(err);
    }
};

exports.getUsersPosts = function (userId, next) {
    "use strict";
    try {
        Post.find({}, next);
    } catch (err) {
        log.error(err);
        next(err);
    }
};

exports.getAppPosts = function (appId, next) {
    "use strict";
    try {
        require('../models/app').App.findById(appId).populate('posts').exec(function (err, app) {
           next(err, app.posts);
        });
    } catch (err) {
        log.error(err);
        next(err);
    }
};