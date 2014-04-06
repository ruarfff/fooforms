/*jslint node: true */
"use strict";

var App = require(global.config.apps.APP).App;
var User = require(global.config.apps.USER).User;
var Cloud = require('../models/cloud').Cloud;
var log = require(global.config.apps.LOGGING).LOG;
var cloudMembers = require('./cloudMembers');
var cloudErrors = require('./cloudErrors');

/**
 * Only allows updating of basic Cloud data.
 * Does not update owner, members or apps.
 *
 * @param cloudJson
 * @param next
 */
var updateCloud = function (cloudJson, next) {
    try {
        Cloud.findByIdAndUpdate(cloudJson._id, {
            name: cloudJson.name,
            description: cloudJson.description,
            icon: cloudJson.icon,
            menuLabel: cloudJson.menuLabel
        }, { multi: false }, function (err, cloud) {
            if(!cloud && !err) {
                err = cloudErrors.cloudNotFoundError;
            }
            next(err, cloud);
        });
    } catch (err) {
        log.error(err);
        next(err);
    }
};

/**
 * Passes a cloud to the callback.
 * If the app is already published the cloud will be the one it is already published too.
 * If the app has not been published the cloud will be empty.
 *
 * @param appId
 * @param userId
 * @param next
 */
var checkIfAppAlreadyPublished = function (appId, userId, next) {
    try {
        User.findById(userId).populate('cloudMemberships').exec(function (err, user) {
            if (err) {
                return (next(err));
            }
            if (!user) {
                return (next(cloudErrors.userNotFoundError));
            }
            var cloudQuery = require('./cloudQuery');
            cloudQuery.getUserClouds(user._id, function (err, clouds) {
                if (err) {
                    return (next(err));
                }
                var cloudCount = 0;
                var i;
                if (clouds) {
                    cloudCount = clouds.length;
                    for (i = 0; i < cloudCount; i++) {
                        if (clouds[i].apps) {
                            if (clouds[i].apps.indexOf(appId) > -1) {
                                return next(err, clouds[i]);
                            }
                        }
                    }
                }
                if (user.cloudMemberships) {
                    cloudCount = user.cloudMemberships.length;
                    for (i = 0; i < cloudCount; i++) {
                        if (user.cloudMemberships[i].apps) {
                            if (user.cloudMemberships[i].apps.indexOf(appId) > -1) {
                                return next(err, user.cloudMemberships[i]);
                            }
                        }
                    }
                }
                return next(err, false);
            });
        });
    } catch (err) {
        log.error(err);
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
    try {
        Cloud.findById(cloudId, function (err, cloud) {
            if (!err && !cloud) {
                err = cloudErrors.cloudNotFoundError;
            }
            if (err) {
                log.error(err);
                return next(err);
            }

            App.findById(appId).populate('owner').exec(function (err, app) {
                if(!err && !app) {
                    err = cloudErrors.appNotFoundError;
                }
                if (err) {
                    log.error(err);
                    return next(err);
                }

                if (cloudMembers.userHasWritePermissionInCloud(cloud, app.owner)) {
                    if (!cloud.apps) {
                        cloud.apps = [];
                    }
                    checkIfAppAlreadyPublished(app._id, app.owner._id, function (err, cloudAppPublishedTo) {
                        if (err) {
                            return next(err);
                        }
                        if (cloudAppPublishedTo) {
                            return next(cloudErrors.appAlreadyPublishedError, cloud);
                        }
                        cloud.apps.push(app._id);
                        cloud.save(next);
                    });
                } else {
                    return next(cloudErrors.userNotAuthorisedToPublishError, cloud);
                }
            });

        });
    } catch (err) {
        log.error(err);
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
    try {
        Cloud.findById(cloudId, function (err, cloud) {
            if (!err && !cloud) {
                err = cloudErrors.cloudNotFoundError;
            }
            if (err) {
                log.error(err);
                return next(err);
            }
            if (cloud.apps) {
                var index = cloud.apps.indexOf(appId);
                if (index > -1) {
                    cloud.apps.pull(appId);
                    cloud.save(next);
                } else {
                    return next(cloudErrors.appNotInCloudError, cloud);
                }
            } else {
                return next(cloudErrors.cloudHasNoAppsError, cloud);
            }

        });
    } catch (err) {
        log.error(err);
        next(err);
    }
};

/**
 * This will remove an app from its current cloud and add it the the cloud
 * specified with the cloudId parameter
 *
 * @param cloudId
 * @param appId
 * @param next
 */
var moveAppFromOneCloudToAnother = function(cloudId, appId, next) {
    try {
        App.findById(appId).populate('owner').exec(function (err, app) {
            if (!err && !app) {
                err = cloudErrors.appNotFoundError;
            }
            if (err) {
                log.error(err);
                return next(err);
            }
            checkIfAppAlreadyPublished(app._id, app.owner._id, function (err, cloudAppPublishedTo) {
                if(!err && !cloudAppPublishedTo) {
                    err = cloudErrors.appNotInCloudError;
                }
                if (err) {
                    log.error(err);
                    return next(err);
                }
                Cloud.findById(cloudId, function (err, cloudToMoveAppTo) {
                    if(!err && !cloudToMoveAppTo) {
                        err = cloudErrors.cloudNotFoundError;
                    }
                    if (err) {
                        log.error(err);
                        return next(err);
                    }
                   if(!cloudMembers.userHasWritePermissionInCloud(cloudToMoveAppTo, app.owner)) {
                       return next(cloudErrors.userNotAuthorisedToPublishError);
                   }
                    removeAppFromCloud(cloudAppPublishedTo._id, app._id, function (err, cloud) {
                        if(!err && !cloud) {
                            err = cloudErrors.appNotInCloudError;
                        }
                        if (err) {
                            log.error(err);
                            return next(err);
                        }
                        addAppToCloud(cloudToMoveAppTo._id, app._id, next);
                    });
                });
            });
        });
    } catch (err) {
        log(err);
        return next(err);
    }
};

/**
 * This will create a new app document with all the same values as the app
 * referenced by the appId parameter. A new ID will be assigned to the copied app
 * and it will not contain any of the posts that were present in the original app
 *
 * @param cloudId
 * @param appId
 * @param next
 */
var copyAppToCLoud = function(cloudId, appId, next) {
    try {
        App.findById(appId).populate('owner').exec(function (err, app) {
            if (!err && !app) {
                err = cloudErrors.appNotFoundError;
            }
            if (err) {
                log.error(err);
                return next(err);
            }
            checkIfAppAlreadyPublished(app._id, app.owner._id, function (err, cloudAppPublishedTo) {
                if(!err && !cloudAppPublishedTo) {
                    err = cloudErrors.appNotInCloudError;
                }
                if (err) {
                    log.error(err);
                    return next(err);
                }
                Cloud.findById(cloudId, function (err, cloudToCopyAppTo) {
                    if(!err && !cloudToCopyAppTo) {
                        err = cloudErrors.cloudNotFoundError;
                    }
                    if (err) {
                        log.error(err);
                        return next(err);
                    }
                    if(!cloudMembers.userHasWritePermissionInCloud(cloudToCopyAppTo, app.owner)) {
                        return next(cloudErrors.userNotAuthorisedToPublishError);
                    }
                    var appCopy = {
                        name: app.name,
                        description: app.description || '',
                        icon: app.icon || '',
                        menuLabel: app.menuLabel || '',
                        owner: app.owner,
                        cloud: cloudToCopyAppTo._id,
                        btnLabel: app.btnLabel || '',
                        settings: app.settings || {},
                        fields: app.fields || [],
                        formEvents: [],
                        sharing: {},
                        privileges: String

                    };
                    require(global.config.apps.APP).createApp(appCopy, function (err, app) {
                        if(!err && !app) {
                            err = cloudErrors.appNotFoundError;
                        }
                        if (err) {
                            log.error(err);
                            return next(err);
                        }
                        addAppToCloud(cloudToCopyAppTo._id, app._id, next);
                    });
                });
            });
        });
    } catch (err) {
        log(err);
        return next(err);
    }
};

/**
 * Get all apps belonging to a cloud
 *
 * @param cloudId
 * @param next
 */
var getCloudApps = function (cloudId, next) {
    try {
        Cloud.findById(cloudId).populate('apps').exec(function (err, cloud) {
            if(!err && !cloud) {
                return next(cloudErrors.cloudNotFoundError);
            }
            if(cloud) {
                return next(err, cloud.apps);
            } else {
                return next(err);
            }
        });
    } catch (err) {
        log.error(err);
        return next(err);
    }
};

/**
 * Get just the app names that were published to a cloud
 *
 * @param cloudId
 * @param next
 */
var getCloudAppNames = function (cloudId, next) {
    try {
        Cloud.findById(cloudId).populate('apps', 'name').exec(function (err, cloud) {
            if(!err && !cloud) {
                return next(cloudErrors.cloudNotFoundError);
            }
            var names = [];
            var i = 0;
            var count = (cloud.apps && cloud.apps.length) ? cloud.apps.length : 0;
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
    getCloudAppNames: getCloudAppNames,
    moveAppFromOneCloudToAnother: moveAppFromOneCloudToAnother,
    copyAppToCLoud: copyAppToCLoud
};