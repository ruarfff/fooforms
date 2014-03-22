/*jslint node: true */
"use strict";

var log = require(global.config.apps.LOGGING).LOG;

var getPostById = function (id, next) {
    try {
        require('../models/post').Post.findById(id, next);
    } catch (err) {
        log.error(err);
        next(err);
    }
};

var getAllPosts = function (next) {
    try {
        require('../models/post').Post.find({}, next);
    } catch (err) {
        log.error(err);
        next(err);
    }
};

var getUserPosts = function (userId, next) {
    try {
        require('../models/post').Post.find({}, next);
    } catch (err) {
        log.error(err);
        next(err);
    }
};

var getAppPosts = function (appId, next) {
    try {
        require('../models/app').App.findById(appId).populate('posts').exec(function (err, app) {
           next(err, app.posts);
        });
    } catch (err) {
        log.error(err);
        next(err);
    }
};

module.exports = {
    getAppPosts: getAppPosts,
    getUserPosts: getUserPosts,
    getAllPosts: getAllPosts,
    getPostById: getPostById
};