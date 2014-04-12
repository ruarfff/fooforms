/*jslint node: true */
"use strict";

var Form = require(global.config.modules.FORM).Form;
var User = require(global.config.modules.USER).User;
var Cloud = require('../models/cloud').Cloud;
var log = require(global.config.modules.LOGGING).LOG;
var cloudMembers = require('./cloudMembers');
var cloudErrors = require('./cloudErrors');

/**
 * Only allows updating of basic Cloud data.
 * Does not update owner, members or forms.
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
        log.error(__filename, ' - ', err);
        next(err);
    }
};

/**
 * Passes a cloud to the callback.
 * If the form is already published the cloud will be the one it is already published too.
 * If the form has not been published the cloud will be empty.
 *
 * @param formId
 * @param userId
 * @param next
 */
var checkIfFormAlreadyPublished = function (formId, userId, next) {
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
                        if (clouds[i].forms) {
                            if (clouds[i].forms.indexOf(formId) > -1) {
                                return next(err, clouds[i]);
                            }
                        }
                    }
                }
                if (user.cloudMemberships) {
                    cloudCount = user.cloudMemberships.length;
                    for (i = 0; i < cloudCount; i++) {
                        if (user.cloudMemberships[i].forms) {
                            if (user.cloudMemberships[i].forms.indexOf(formId) > -1) {
                                return next(err, user.cloudMemberships[i]);
                            }
                        }
                    }
                }
                return next(err, false);
            });
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};


/**
 * Add a single form to a Cloud. Will not allow
 * addition of Form owned by a User without permissions.
 *
 * @param cloudId
 * @param formId
 * @param next
 */
var addFormToCloud = function (cloudId, formId, next) {
    try {
        Cloud.findById(cloudId, function (err, cloud) {
            if (!err && !cloud) {
                err = cloudErrors.cloudNotFoundError;
            }
            if (err) {
                log.error(__filename, ' - ', err);
                return next(err);
            }

            Form.findById(formId).populate('owner').exec(function (err, form) {
                if(!err && !form) {
                    err = cloudErrors.formNotFoundError;
                }
                if (err) {
                    log.error(__filename, ' - ', err);
                    return next(err);
                }

                if (cloudMembers.userHasWritePermissionInCloud(cloud, form.owner)) {
                    if (!cloud.forms) {
                        cloud.forms = [];
                    }
                    checkIfFormAlreadyPublished(form._id, form.owner._id, function (err, cloudFormPublishedTo) {
                        if (err) {
                            return next(err);
                        }
                        if (cloudFormPublishedTo) {
                            return next(cloudErrors.formAlreadyPublishedError, cloud);
                        }
                        cloud.forms.push(form._id);
                        cloud.save(next);
                    });
                } else {
                    return next(cloudErrors.userNotAuthorisedToPublishError, cloud);
                }
            });

        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

/**
 * Delete an form from a cloud if it exists.
 *
 * @param cloudId
 * @param formId
 * @param next
 */
var removeFormFromCloud = function (cloudId, formId, next) {
    try {
        Cloud.findById(cloudId, function (err, cloud) {
            if (!err && !cloud) {
                err = cloudErrors.cloudNotFoundError;
            }
            if (err) {
                log.error(__filename, ' - ', err);
                return next(err);
            }
            if (cloud.forms) {
                var index = cloud.forms.indexOf(formId);
                if (index > -1) {
                    cloud.forms.pull(formId);
                    cloud.save(next);
                } else {
                    return next(cloudErrors.formNotInCloudError, cloud);
                }
            } else {
                return next(cloudErrors.cloudHasNoFormsError, cloud);
            }

        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

/**
 * This will remove an form from its current cloud and add it the the cloud
 * specified with the cloudId parameter
 *
 * @param cloudId
 * @param formId
 * @param next
 */
var moveFormFromOneCloudToAnother = function(cloudId, formId, next) {
    try {
        Form.findById(formId).populate('owner').exec(function (err, form) {
            if (!err && !form) {
                err = cloudErrors.formNotFoundError;
            }
            if (err) {
                log.error(__filename, ' - ', err);
                return next(err);
            }
            checkIfFormAlreadyPublished(form._id, form.owner._id, function (err, cloudFormPublishedTo) {
                if(!err && !cloudFormPublishedTo) {
                    err = cloudErrors.formNotInCloudError;
                }
                if (err) {
                    log.error(__filename, ' - ', err);
                    return next(err);
                }
                Cloud.findById(cloudId, function (err, cloudToMoveFormTo) {
                    if(!err && !cloudToMoveFormTo) {
                        err = cloudErrors.cloudNotFoundError;
                    }
                    if (err) {
                        log.error(__filename, ' - ', err);
                        return next(err);
                    }
                   if(!cloudMembers.userHasWritePermissionInCloud(cloudToMoveFormTo, form.owner)) {
                       return next(cloudErrors.userNotAuthorisedToPublishError);
                   }
                    removeFormFromCloud(cloudFormPublishedTo._id, form._id, function (err, cloud) {
                        if(!err && !cloud) {
                            err = cloudErrors.formNotInCloudError;
                        }
                        if (err) {
                            log.error(__filename, ' - ', err);
                            return next(err);
                        }
                        addFormToCloud(cloudToMoveFormTo._id, form._id, next);
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
 * This will create a new form document with all the same values as the form
 * referenced by the formId parameter. A new ID will be assigned to the copied form
 * and it will not contain any of the posts that were present in the original form
 *
 * @param cloudId
 * @param formId
 * @param next
 */
var copyFormToCLoud = function(cloudId, formId, next) {
    try {
        Form.findById(formId).populate('owner').exec(function (err, form) {
            if (!err && !form) {
                err = cloudErrors.formNotFoundError;
            }
            if (err) {
                log.error(__filename, ' - ', err);
                return next(err);
            }
            checkIfFormAlreadyPublished(form._id, form.owner._id, function (err, cloudFormPublishedTo) {
                if(!err && !cloudFormPublishedTo) {
                    err = cloudErrors.formNotInCloudError;
                }
                if (err) {
                    log.error(__filename, ' - ', err);
                    return next(err);
                }
                Cloud.findById(cloudId, function (err, cloudToCopyFormTo) {
                    if(!err && !cloudToCopyFormTo) {
                        err = cloudErrors.cloudNotFoundError;
                    }
                    if (err) {
                        log.error(__filename, ' - ', err);
                        return next(err);
                    }
                    if(!cloudMembers.userHasWritePermissionInCloud(cloudToCopyFormTo, form.owner)) {
                        return next(cloudErrors.userNotAuthorisedToPublishError);
                    }
                    var formCopy = {
                        name: form.name,
                        description: form.description || '',
                        icon: form.icon || '',
                        menuLabel: form.menuLabel || '',
                        owner: form.owner,
                        cloud: cloudToCopyFormTo._id,
                        btnLabel: form.btnLabel || '',
                        settings: form.settings || {},
                        fields: form.fields || [],
                        formEvents: [],
                        sharing: {},
                        privileges: String

                    };
                    require(global.config.modules.FORM).createForm(formCopy, function (err, form) {
                        if(!err && !form) {
                            err = cloudErrors.formNotFoundError;
                        }
                        if (err) {
                            log.error(__filename, ' - ', err);
                            return next(err);
                        }
                        addFormToCloud(cloudToCopyFormTo._id, form._id, next);
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
 * Get all forms belonging to a cloud
 *
 * @param cloudId
 * @param next
 */
var getCloudForms = function (cloudId, next) {
    try {
        Cloud.findById(cloudId).populate('forms').exec(function (err, cloud) {
            if(!err && !cloud) {
                return next(cloudErrors.cloudNotFoundError);
            }
            if(cloud) {
                return next(err, cloud.forms);
            } else {
                return next(err);
            }
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        return next(err);
    }
};

/**
 * Get just the form names that were published to a cloud
 *
 * @param cloudId
 * @param next
 */
var getCloudFormNames = function (cloudId, next) {
    try {
        Cloud.findById(cloudId).populate('forms', 'name').exec(function (err, cloud) {
            if(!err && !cloud) {
                return next(cloudErrors.cloudNotFoundError);
            }
            var names = [];
            var i = 0;
            var count = (cloud.forms && cloud.forms.length) ? cloud.forms.length : 0;
            for (i; i < count; i++) {
                names.push(cloud.forms[i].name);
            }
            next(err, names);
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

module.exports = {
    updateCloud: updateCloud,
    addFormToCloud: addFormToCloud,
    removeFormFromCloud: removeFormFromCloud,
    getCloudForms: getCloudForms,
    getCloudFormNames: getCloudFormNames,
    moveFormFromOneCloudToAnother: moveFormFromOneCloudToAnother,
    copyFormToCLoud: copyFormToCLoud
};