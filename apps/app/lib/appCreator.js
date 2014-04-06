/*jslint node: true */

var App = require('../models/app').App;
var appErrors = require('./appErrors');
var log = require(global.config.apps.LOGGING).LOG;

exports.createApp = function (appJSON, next) {
    "use strict";
    try {
        var app = new App(appJSON);

        app.save(function (err, app) {
            if (err) {
                return next(err);
            }
            if (!app.cloud) {
                var User = require(global.config.apps.USER).User;
                User.findById(app.owner, function (err, user) {
                    if (err) {
                        return next(err);
                    }
                    if (!user) {
                        return next(appErrors.ownerNotFoundError);
                    }
                    app.cloud = user.cloud;
                    require(global.config.apps.CLOUD).addAppToCloud(app.cloud, app._id, function (err, cloud) {
                        if (err) {
                            return next(err);
                        }
                        if (!cloud) {
                            return next(appErrors.folderNotFoundError);
                        }
                        return (next(err, app));
                    });
                });
            } else {
                return (next(err, app));
            }
        });

    } catch (err) {
        log.error(err);
        next(err);
    }

};
