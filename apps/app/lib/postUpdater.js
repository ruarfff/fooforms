/*jslint node: true */

var Post = require('../models/post').Post;
var log = require(global.config.apps.LOGGING).LOG;

exports.updatePost = function (postJson, next) {
    "use strict";
    try {
        Post.findByIdAndUpdate(postJson._id, {
            name: postJson.name,
            description: postJson.description,
            icon: postJson.icon,
            menuLabel: postJson.menuLabel,
            owner: postJson.owner
        }, { multi: false }, function (err, post) {
            next(err, post);
        });
    } catch (err) {
        log.error(err.toString());
        next(err, null);
    }

};
