/*jslint node: true */
var Cloud = require('../models/cloud').Cloud;
var log = require(global.config.modules.LOGGING).LOG;

var getCloudById = function (id, next) {
    "use strict";
    try {
        Cloud.findById(id, function (err, cloud) {
            next(err, cloud);
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

var getCloudByName = function (name, next) {
    "use strict";
    try {
        Cloud.findByName(name, next);
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

var getAllClouds = function (next) {
    "use strict";
    try {
        Cloud.find({}, function (err, cloud) {
            next(err, cloud);
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

var getCloudOwner = function (cloudId, next) {
    try {
        Cloud.findById(cloudId).populate('owner').exec(function (err, cloud) {
            next(err, cloud.owner);
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        return next(err);
    }
};

/**
 * Get all Clouds owned by a particular user
 *
 * @param userId
 * @param next
 */
var getUserClouds = function (userId, next) {
    "use strict";
    try {
        Cloud.findByOwner(userId, function (err, clouds) {
            next(err, clouds);
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

module.exports = {
    getCloudById: getCloudById,
    getCloudByName: getCloudByName,
    getAllClouds: getAllClouds,
    getCloudOwner: getCloudOwner,
    getUserClouds: getUserClouds
};
