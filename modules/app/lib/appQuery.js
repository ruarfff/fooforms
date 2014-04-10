/*jslint node: true */

var App = require('../models/app').App;
var log = require(global.config.modules.LOGGING).LOG;

exports.getAppById = function (id, next) {
    "use strict";
    try {
        App.findById(id, next);
    } catch (err) {
        log.error(err);
        next(err);
    }
};

exports.getAppsByCloudId = function (cloudId, next) {
    "use strict";
    try {
            next();
    } catch (err) {
        log.error(err);
        next(err);
    }
};

exports.getAppsByUserId = function (userId, next) {
    "use strict";
    try {
        App.find({ owner: userId }, function (err, apps) {
            next(err, apps);
        });
    } catch (err) {
        log.error(err);
        next(err);
    }
};

exports.getAllApps = function (next) {
    "use strict";
    try {
        next();
    } catch (err) {
        log.error(err);
        next(err);
    }
};
