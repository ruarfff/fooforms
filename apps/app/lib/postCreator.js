/*jslint node: true */

var App = require('../models/app').App;
var Post = require('../models/post').Post;

var log = require(global.config.apps.LOGGING).LOG;

exports.createPost = function (postJSON, appId, next) {
    "use strict";
    try {
        log.debug(JSON.stringify(appJSON));
        var app = new App(appJSON);
        app.save(function (err) {
            next(err, app);
        });
    } catch (err) {
        log.error(err.toString());
        next(err, null);
    }

};
