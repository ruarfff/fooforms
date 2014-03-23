/*jslint node: true */
"use strict";

var log = require(global.config.apps.LOGGING).LOG;
var appErrors = require('./appErrors');
var async = require("async");


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
        require(global.config.apps.CLOUD).Cloud.find({owner: userId}).populate('apps').exec(function (err, clouds) {
            if (err) return next(err);
            if (!clouds) return next(appErrors.userCloudsNotFound);

            var userPosts = [];

            async.each(clouds,
                function(cloud, done){
                    require('../models/app').App.populate(cloud.apps, 'posts', function(err, apps) {
                        if (err) return done(err);
                        apps.forEach(function (app) {
                            app.posts.forEach(function (post) {
                                userPosts.push(post);
                            });
                        });
                        return done();
                    });
                },
                function(err){
                    return next(err, userPosts);
                }
            );

        });

    } catch (err) {
        log.error(err);
        next(err);
    }
};

var getCloudPosts = function (cloudId, next) {
    try {
        require(global.config.apps.CLOUD).Cloud.findById(cloudId).populate('apps').exec(function(err, cloud) {
            require('../models/app').App.populate(cloud.apps, 'posts', function(err, apps) {
                if (err) return next(err);
                var cloudPosts = [];
                apps.forEach(function (app) {
                    app.posts.forEach(function (post) {
                        cloudPosts.push(post);
                    });
                });
                return next(err, cloudPosts);
            });
        });
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
    getPostById: getPostById,
    getCloudPosts: getCloudPosts
};