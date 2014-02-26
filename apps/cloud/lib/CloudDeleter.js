/*jslint node: true */

var Cloud = require('../models/cloud').Cloud;
var log = require(global.config.apps.LOGGING).LOG;

exports.deleteCloudById = function (id, next) {
    "use strict";
    try {
        Cloud.findById(id, function (err, cloud) {
            if (err) {
                next(err, cloud);
            } else {
                cloud.remove(function (err, cloud) {
                    if (err) {
                        next(err, cloud);
                    } else {
                        Cloud.findById(cloud._id, function (err, cloudThatShouldBeNull) {
                            if (cloudThatShouldBeNull) {
                                err.code = 500;
                                err.data = 'Error deleting cloud';
                            }
                            next(err, cloudThatShouldBeNull);
                        });
                    }
                });
            }
        });
    } catch (err) {
        log.error(err.toString());
        next(err, null);
    }

};
