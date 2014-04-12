/*jslint node: true */

var Cloud = require('../models/cloud').Cloud;
var log = require(global.config.modules.LOGGING).LOG;
var async = require("async");

exports.deleteCloudById = function (id, next) {
    "use strict";
    try {
        Cloud.findById(id).populate('forms').exec(function (err, cloud) {
            if (err) {
                log.error(__filename, ' - ', err);
                return next(err, cloud);
            }
            var cloudForms = cloud.forms;
            cloud.remove(function (err, cloud) {
                if (err) {
                    log.error(__filename, ' - ', err);
                    return next(err, cloud);
                }
                Cloud.findById(cloud._id, function (err, cloudThatShouldBeNull) {
                    if (cloudThatShouldBeNull && !err) {
                        err.http_code = 500;
                        err.data = 'Error deleting cloud';
                    }
                    if (err) {
                        log.error(__filename, ' - ', err);
                        return next(err);
                    }
                    if (cloudForms && cloudForms.length > 0) {
                        var formLib = require(global.config.modules.FORM);
                        async.each(cloudForms,
                            function (form, done) {
                                formLib.deleteFormById(form._id, function (err) {
                                    if (err) {
                                        log.error(__filename, ' - ', err);
                                    }
                                    return done();
                                });
                            },
                            function (err) {
                                next(err);
                            }
                        );
                    } else {
                        return next();
                    }
                });
            });
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }

};
