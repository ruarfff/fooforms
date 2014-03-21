/*jslint node: true */

var App = require('../models/app').App;
var log = require(global.config.apps.LOGGING).LOG;

exports.createApp = function (appJSON, next) {
    "use strict";
    try {
        var app = new App(appJSON);
        app.save(next);
    } catch (err) {
        log.error(err);
        next(err);
    }

};
