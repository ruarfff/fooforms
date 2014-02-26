/*jslint node: true */

var App = require('../models/app').App;
var log = require(global.config.apps.LOGGING).LOG;

exports.updateApp = function (appJson, next) {
    "use strict";
    try {

    } catch (err) {
        log.error(err.toString());
        next(err, null);
    }

};
