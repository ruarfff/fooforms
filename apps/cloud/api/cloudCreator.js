/*jslint node: true */
'use strict';

var cloudLib = require(global.config.apps.CLOUD);
var log = require(global.config.apps.LOGGING).LOG;

/**
 * Create new user
 */
exports.create = function (req, res) {
    cloudLib.createCloud(req.body, function (err, cloud) {
        if (err) {
            log.error(err.toString());
        }
    });
};
