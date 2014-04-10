/*jslint node: true */

var Cloud = require('../models/cloud').Cloud;
var log = require(global.config.modules.LOGGING).LOG;

exports.createCloud = function (cloudJSON, next) {
    "use strict";
    try {
        var _cloud = new Cloud(cloudJSON);
        _cloud.save(next);
    } catch (err) {
        log.error(err.toString());
        next(err, null);
    }

};
