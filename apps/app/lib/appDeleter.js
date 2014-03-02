/*jslint node: true */

var App = require('../models/app').App;
var log = require(global.config.apps.LOGGING).LOG;

exports.deleteAppById = function (id, next) {
    "use strict";
    try {
        App.findById(id, function (err, app) {
            if (err) {
                next(err, app);
            } else {
                app.remove(function (err, cloud) {
                    if (err) {
                        next(err, cloud);
                    } else {
                        App.findById(cloud._id, function (err, appThatShouldBeNull) {
                            if (appThatShouldBeNull) {
                                err.code = 500;
                                err.data = 'Error deleting app';
                            }
                            next(err, appThatShouldBeNull);
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
