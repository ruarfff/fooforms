/*jslint node: true */

var App = require('../models/app').App;
var Post = require('../models/post').Post;
var appErrors = require('./appErrors');

var log = require(global.config.apps.LOGGING).LOG;

exports.createPost = function (postJSON, appId, next) {
    "use strict";
    try {
        App.findById(appId, function (err, app) {
            if(err) return next(err);
            if(!app) return next(appErrors.appNotFoundError);
            var post = new Post(postJSON);
            post.app = app._id;
            post.save(function (err, post) {
                if(err) return next(err);
                if(!post) return next(appErrors.postNotCreatedError);
                if(!app.posts) {
                    app.posts = [];
                }
                app.posts.push(post._id);
                app.save(function (err) {
                    next(err, post);
                });
            });
        });

    } catch (err) {
        log.error(err);
        next(err);
    }

};
