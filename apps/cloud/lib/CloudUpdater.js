/*jslint node: true */

var App = require(global.config.apps.APP).App;
var Cloud = require('../models/cloud').Cloud;
var log = require(global.config.apps.LOGGING).LOG;
var cloudUtil = require('./cloudUtil');

// Only allows updating of basic Cloud data.
// Does not update owner, members or apps.
exports.updateCloud = function (cloudJson, next) {
    "use strict";
    try {
        Cloud.findByIdAndUpdate(cloudJson._id, {
            name: cloudJson.name,
            description: cloudJson.description,
            icon: cloudJson.icon,
            menuLabel: cloudJson.menuLabel
        }, { multi: false }, function (err, cloud) {
            next(err, cloud);
        });
    } catch (err) {
        log.error(err.toString());
        next(err);
    }
};

// Add a single app to a Cloud. Will not allow 
// addition of App owned by a User without permissions.
exports.addAppToCloud = function (cloudId, appId, next) {
    "use strict"
    try {
        Cloud.findById(cloudId, function (err, cloud) {
            if (err) {
                return next(err);
            }
            App.findById(appId, function (err, app) {
                if (err) {
                    return next(err);
                }
                if (cloudUtil.userHasWritePermissionInCloud(cloud, app.owner)) {
                    if (!cloud.apps) {
                        cloud.apps = [];
                    }
                    cloud.apps.push(app._id);
                    cloud.save(next);
                } else {
                    var error = new Error('App owner not authorised to publish to this cloud.');
                    error.http_code = 403; // Forbidden
                    return next(error);
                }
            });

        });
    } catch (err) {
        log.error(err.toString());
        next(err);
    }
};
