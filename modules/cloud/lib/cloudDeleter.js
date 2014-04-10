/*jslint node: true */

var Cloud = require('../models/cloud').Cloud;
var log = require(global.config.modules.LOGGING).LOG;
var async = require("async");

exports.deleteCloudById = function (id, next) {
    "use strict";
    try {
        Cloud.findById(id).populate('apps').exec(function (err, cloud) {
            if (err) {
                log.error(err);
                return next(err, cloud);
            }
            var cloudApps = cloud.apps;
            cloud.remove(function (err, cloud) {
                Cloud.findById(cloud._id, function (err, cloudThatShouldBeNull) {
                    if (cloudThatShouldBeNull && !err) {
                        err.http_code = 500;
                        err.data = 'Error deleting cloud';
                    }
                    if (err) {
                        log.error(err);
                        return next(err);
                    }
                    if (cloudApps && cloudApps.length > 0) {
                        async.each(cloudApps,
                            function (app, done) {
                                app.remove(function (err) {
                                    if (err) {
                                        log.error(err);
                                    }
                                    return done();
                                });
                            },
                            function (err) {
                                next(err);
                            }
                        );
                    }
                    return next();
                });
            });
        });
    } catch (err) {
        log.error(err);
        next(err);
    }

};
