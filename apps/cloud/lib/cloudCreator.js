/*jslint node: true */

var Cloud = require('../models/cloud').Cloud;
var log = require(global.config.apps.LOGGING).LOG;

exports.createCloud = function (cloudJSON, next) {
    "use strict";
    var cloud = new Cloud(cloudJSON);

    cloud.save(function (err) {
        if (err) {
            log.error(err.toString());
        }
        next(err, user);
    });
};
