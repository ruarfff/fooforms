/*jslint node: true */
var Cloud = require('../models/cloud').Cloud;
var log = require(global.config.apps.LOGGING).LOG;

exports.getCloudById = function (id, next) {
    "use strict";
    try {
        Cloud.findById(id, function (err, cloud) {
            next(err, cloud);
        });
    } catch (err) {
        log.error(err.toString());
        next(err, null);
    }
};

exports.getAllClouds = function (next) {
    "use strict";
    try {
        Cloud.find({}, function (err, cloud) {
            next(err, cloud);
        });
    } catch (err) {
        log.error(err.toString());
        next(err, null);
    }
};

exports.getUserClouds = function (userId, next) {
    "use strict";
    try {
        Cloud.find({ owner: userId }, function (err, clouds) {
            next(err, clouds);
        });
    } catch (err) {
        log.error(err.toString());
        next(err, null);
    }
};