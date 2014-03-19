/*jslint node: true */

var App = require(global.config.apps.APP).App;
var User = require(global.config.apps.USER).User;
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
var updateCloud = function (cloudJson, next) {
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

var checkIfAppAlreadyPublished = function (appId, userId, next) {
    "use strict";
    try {
        User.findById(userId).populate('cloudMemberships').exec(function (err, user) {
            if (err) return (next(err));
            if (!user) return (next(new Error('Could not find user with id ' + userId)));
            var cloudQuery = require('./cloudQuery');
            cloudQuery.getUserClouds(user._id, function (err, clouds) {
                if (err) return (next(err));
                var cloudCount = 0;
                var i;
                if (clouds) {
                    cloudCount = clouds.length;
                    for (i = 0; i < cloudCount; i++) {
                        if (clouds[i].apps) {
                            if (clouds[i].apps.indexOf(appId) > -1) {
                                return next(err, true);
                            }
                        }
                    }
                }
                if (user.cloudMemberships) {
                    cloudCount = user.cloudMemberships.length;
                    for (i = 0; i < cloudCount; i++) {
                        if (user.cloudMemberships[i].apps) {
                            if (user.cloudMemberships[i].apps.indexOf(appId) > -1) {
                                return next(err, true);
                            }
                        }
                    }
                }
                return next(err, false);
            });
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
var addAppToCloud = function (cloudId, appId, next) {
    "use strict";
    try {
        Cloud.findById(cloudId, function (err, cloud) {
            if (err) {
                return next(err);
            }
            if (!cloud) {
                return next(new Error('Cloud not find cloud with id ' + cloudId));
            }
            App.findById(appId).populate('owner').exec(function (err, app) {
                if (err) return next(err);
                if (!app) return next(new Error('Could not find app ' + appId));
                if (cloudMembers.userHasWritePermissionInCloud(cloud, app.owner)) {
                    if (!cloud.apps) {
                        cloud.apps = [];
                    }
                    checkIfAppAlreadyPublished(app._id, app.owner._id, function (err, published) {
                        if (err) return next(err);
                        if (published) {
                            var appAlreadyPublishedError = new Error('App is already published to a Cloud.');
                            appAlreadyPublishedError.http_code = 403; // Forbidden
                            return next(appAlreadyPublishedError, cloud);
                        }
                        cloud.apps.push(app._id);
                        cloud.save(next);
                    });
                } else {
                    var notAuthorisedError = new Error('App owner not authorised to publish to this cloud.');
                    notAuthorisedError.http_code = 403; // Forbidden
                    return next(notAuthorisedError, cloud);
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
var removeAppFromCloud = function (cloudId, appId, next) {
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
        log.error(err);
        next(err);
    }
};

/**
 * Get all apps belonging to a cloud
 *
 * @param cloudId
 * @param next
 */
var getCloudApps = function (cloudId, next) {
    "use strict";
    try {
        Cloud.findById(cloudId).populate('apps').exec(function (err, cloud) {
            next(err, cloud.apps);
        });
    } catch (err) {
        log.error(err);
        next(err);
    }
};

/**
 * Get just the app names that were published to a cloud
 *
 * @param cloudId
 * @param next
 */
var getCloudAppNames = function (cloudId, next) {
    "use strict";
    try {
        Cloud.findById(cloudId).populate('apps', 'name').exec(function (err, cloud) {
            var names = [];
            var i = 0;
            var count = cloud.apps.length;
            for (i; i < count; i++) {
                names.push(cloud.apps[i].name);
            }
            next(err, names);
        });
    } catch (err) {
        log.error(err);
        next(err);
    }
};

module.exports = {
    updateCloud: updateCloud,
    addAppToCloud: addAppToCloud,
    removeAppFromCloud: removeAppFromCloud,
    getCloudApps: getCloudApps,
    getCloudAppNames: getCloudAppNames
};