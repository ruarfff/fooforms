/*jslint node: true */

var Cloud = require('../models/cloud').Cloud;
var log = require(global.config.apps.LOGGING).LOG;

exports.updateCloud = function (cloudJson, next) {
    "use strict";
    try {
        Cloud.findByIdAndUpdate(cloudJson._id, {
            name: cloudJson.name,
            description: cloudJson.description,
            icon: cloudJson.icon,
            menuLabel: cloudJson.menuLabel,
            owner: cloudJson.owner
        }, { multi: false }, function (err, cloud) {
            next(err, cloud);
        });
    } catch (err) {
        log.error(err.toString());
        next(err, null);
    }

};
