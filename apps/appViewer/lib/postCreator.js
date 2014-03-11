/*jslint node: true */

var Post = require('../models/post').Post;
var log = require(global.config.apps.LOGGING).LOG;

exports.createPost = function (postJSON, next) {
    "use strict";
    try {
        log.debug(JSON.stringify(postJSON));
        var post = new Post(postJSON);
        post.save(function (err) {
            next(err, post);
        });
    } catch (err) {
        log.error(err.toString());
        next(err, null);
    }

};
