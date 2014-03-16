/*jslint node: true */

var App = require(global.config.apps.APP).App;
var Cloud = require('../models/cloud').Cloud;
var log = require(global.config.apps.LOGGING).LOG;
var cloudMembers = require('./cloudMembers');

/**
 * Only allows updating of basic Cloud data.
 * Does not update owner, members or apps.
 *
 * @param cloudJson
 * @param next
 */
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


/**
 * Add a single app to a Cloud. Will not allow
 * addition of App owned by a User without permissions.
 *
 * @param cloudId
 * @param appId
 * @param next
 */
exports.addAppToCloud = function (cloudId, appId, next) {
    "use strict";
    try {
        Cloud.findById(cloudId, function (err, cloud) {
            if (err) {
                return next(err);
            }
            if (!cloud) {
                return next(new Error('Cloud not find cloud with id ' + cloudId));
            }
            App.findById(appId, function (err, app) {
                if (err) {
                    return next(err);
                }
                if (!app) {
                    return next(new Error('Could not find app ' + appId));
                }
                if (cloudMembers.userHasWritePermissionInCloud(cloud, app.owner)) {
                    if (!cloud.apps) {
                        cloud.apps = [];
                    }
                    cloud.apps.push(app._id);
                    cloud.save(next);
                } else {
                    var error = new Error('App owner not authorised to publish to this cloud.');
                    error.http_code = 403; // Forbidden
                    return next(error, cloud);
                }
            });

        });
    } catch (err) {
        log.error(err.toString());
        next(err);
    }
};

/**
 * Delete an app from a cloud if it exists.
 *
 * @param cloudId
 * @param appId
 * @param next
 */
exports.removeAppFromCloud = function (cloudId, appId, next) {
    "use strict";
    try {
        Cloud.findById(cloudId, function (err, cloud) {
            if (err) {
                return next(err);
            }
            if (!cloud) {
                return next(new Error('Cloud not find cloud with id ' + cloudId));
            }
            if (cloud.apps) {
                var index = cloud.apps.indexOf(appId);
                if (index > -1) {
                    cloud.apps.splice(index, 1);
                    cloud.save(next);
                } else {
                    return next(new Error('App does not exist in cloud'), cloud);
                }
            } else {
                return next(new Error('Cloud has no apps to remove'), cloud);
            }

        });
    } catch (err) {
        log.error(err.toString());
        next(err);
    }
};

/**
 * Get all app
 *
 * @param next
 */
exports.getCloudApps = function (cloudId, next) {
    "use strict";
};

exports.getCloudAppNames = function (next) {
    "use strict";
};