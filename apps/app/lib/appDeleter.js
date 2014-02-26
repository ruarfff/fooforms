/*jslint node: true */

var App = require('../models/app').App;
var log = require(global.config.apps.LOGGING).LOG;

exports.deleteAppById = function (id, next) {
    "use strict";
    try {

    } catch (err) {
        log.error(err.toString());
        next(err, null);
    }

};
