/*jslint node: true */

var App = require('../models/app').App;
var log = require(global.config.apps.LOGGING).LOG;

exports.getAppById = function (id, next) {
    "use strict";
    try {
        App.findById(id, function (err, app) {
            next(err, app);
        });
    } catch (err) {
        log.error(err.toString());
        next(err, null);
    }
};

exports.getAppsByCloudId = function (cloudId, next) {
    "use strict";
    try {

    } catch (err) {
        log.error(err.toString());
        next(err, null);
    }
};

exports.getAppsByUserId = function (userId, next) {
    "use strict";
    try {
        App.find({ owner: userId }, function (err, apps) {
            next(err, apps);
        });
    } catch (err) {
        log.error(err.toString());
        next(err, null);
    }
};

exports.getAllApps = function (next) {
    "use strict";
    try {

    } catch (err) {
        log.error(err.toString());
        next(err, null);
    }
};
