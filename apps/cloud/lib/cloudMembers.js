/*jslint node: true */

var Cloud = require('../models/cloud').Cloud;
var User = require(global.config.apps.USER).User;
var log = require(global.config.apps.LOGGING).LOG;

/**
 * Checks a cloud to see if the user id corresponds to any cloud membership
 * including Cloud Owner, Cloud Member or Cloud Member with write permissions.
 *
 * @param cloud - Cloud document
 * @param userId - User Id to check if is a member
 * @returns {*}
 */
var userIsCloudMember = function (cloud, userId) {
    "use strict";
    try {
        return (cloud.owner.equals(userId) ||
            (cloud.membersWithWritePermissions && (cloud.membersWithWritePermissions.indexOf(userId) > -1)) ||
            (cloud.members && (cloud.members.indexOf(userId) > -1)));
    } catch (err) {
        log.error(err);
    }
    return false;
};

/**
 * Checks that a User has write permissions for this Cloud.
 *
 * @param cloud - Cloud document
 * @param userId - User Id to check for write permissions
 * @returns {*}
 */
var userHasWritePermissionInCloud = function (cloud, userId) {
    "use strict";
    try {
        return (cloud.owner.equals(userId) || (cloud.membersWithWritePermissions && (cloud.membersWithWritePermissions.indexOf(userId) > -1)));
    } catch (err) {
        log.error(err);
    }
    return false;
};

/**
 * Checks that Cloud member lists have been initialized and initializes them if not.
 *
 * @param cloud - Cloud document
 * @returns {*}
 */
var checkAndCreateCloudMemberLists = function (cloud) {
    "use strict";
    if (!cloud.membersWithWritePermissions) {
        cloud.membersWithWritePermissions = [];
    }
    if (!cloud.members) {
        cloud.members = [];
    }
    return cloud;
};

/**
 * Add a user to the Cloud members list
 *
 * @param cloudId - The objectId of the cloud that will have the member added to it
 * @param userId - The objectId of the user to be added to the clouds members list
 * @param next - Callback. Gets passed err and cloud
 * @returns {*}
 */
var addCloudMember = function (cloudId, userId, next) {
    try {
        Cloud.findById(cloudId, function (err, cloud) {
            if (err) {
                return next(err);
            }
            if (!cloud) {
                return next(new Error('Could not find cloud with id: ' + cloudId));
            }
            User.findById(userId, function (err, user) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return next(new Error('Could not add user to cloud because user with id: ' + user._id + ' does not exist in the database'));
                }
                checkAndCreateCloudMemberLists(cloud);
                if (cloud.owner.equals(user._id)) {
                    return next(new Error('User cannot be made a member of cloud because user with id ' + user._id + ' is the cloud owner'));
                }
                if (userIsCloudMember(cloud, user._id)) {
                    return next(new Error('User with id ' + user._id + ' is already a cloud member'))
                }

                cloud.members.push(user._id);
                cloud.save(next);

            });
        });

    } catch (err) {
        return next(err);
    }
};

/**
 * Grant a user write permissions for a cloud. If the user is not already a member, they will be added to
 * the members list.
 *
 * @param cloudId - The objectId of the cloud that will have the member added to it
 * @param userId - The objectId of the user to be added to the clouds members list
 * @param next - Callback. Gets passed err and cloud
 * @returns {*}
 */
var addCloudMemberWithWritePermissions = function (cloudId, userId, next) {
    try {
        Cloud.findById(cloudId, function (err, cloud) {
            if (err) {
                return next(err);
            }
            if (!cloud) {
                return next(new Error('Could not find cloud with id: ' + cloudId));
            }
            User.findById(userId, function (err, user) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return next(new Error('Could not add user to cloud because user with id: ' + user._id + ' does not exist in the database'));
                }
                checkAndCreateCloudMemberLists(cloud);
                if (cloud.owner.equals(user._id)) {
                    return next(new Error('User cannot be made a member of cloud because user with id ' + user._id + ' is the cloud owner'));
                }
                if (userHasWritePermissionInCloud(cloud, user._id)) {
                    return next(new Error('User with id ' + user._id + 'already has write permissions for cloud with id ' + cloud._id));
                }
                if (!userIsCloudMember(cloud, user._id)) {
                    cloud.members.push(user._id);
                }
                cloud.membersWithWritePermissions.push(user._id);

                cloud.save(next);

            });
        });
    } catch (err) {
        return next(err);
    }
};

/**
 * Remove a user from the cloud members list.
 * If the user is in the write permissions list they will be removed from
 * that also.
 *
 * @param cloudId - The objectId of the cloud that will have the member added to it
 * @param userId - The objectId of the user to be added to the clouds members list
 * @param next - Callback. Gets passed err and cloud
 * @returns {*}
 */
var removeCloudMember = function (cloudId, userId, next) {
    try {
        Cloud.findById(cloudId, function (err, cloud) {
            if (err) {
                return next(err);
            }
            if (!cloud) {
                return next(new Error('Could not find cloud with id: ' + cloudId));
            }
            if (cloud.owner.equals(userId)) {
                return next(new Error('Cannot remove cloud owner from cloud members'));
            }
            if (!userIsCloudMember(cloud, userId)) {
                return next(new Error('User with Id ' + userId + ' is not a cloud member'));
            } else {
                var index = -1;
                if (cloud.members) {
                    index = cloud.members.indexOf(userId);
                    if (index > -1) {
                        cloud.members.splice(index, 1);
                    }
                }
                if (cloud.membersWithWritePermissions) {
                    index = cloud.membersWithWritePermissions.indexOf(userId);
                    if (index > -1) {
                        cloud.membersWithWritePermissions.splice(index, 1);
                    }
                }
                cloud.save(next);
            }
        });
    } catch (err) {
        return next(err);
    }
};

/**
 * Remove a user form a clouds write permissions list but keep them in the members list.
 *
 * @param cloudId - The objectId of the cloud that will have the member added to it
 * @param userId - The objectId of the user to be added to the clouds members list
 * @param next - Callback. Gets passed err and cloud
 * @returns {*}
 */
var removeCloudMemberWritePermissions = function (cloudId, userId, next) {
    try {
        Cloud.findById(cloudId, function (err, cloud) {
            if (err) {
                return next(err);
            }
            if (!cloud) {
                return next(new Error('Could not find cloud with id: ' + cloudId));
            }
            if (cloud.owner.equals(userId)) {
                return next(new Error('Cannot remove write permissions of cloud owner'));
            }
            if (!userIsCloudMember(cloud, userId)) {
                return next(new Error('User with Id ' + userId + ' is not a cloud member'));
            }
            else if (!userHasWritePermissionInCloud(cloud, userId)) {
                return next(new Error('User with Id ' + userId + ' does not have write permissions'));
            } else {
                var index = -1;
                if (cloud.membersWithWritePermissions) {
                    index = cloud.membersWithWritePermissions.indexOf(userId);
                    if (index > -1) {
                        cloud.membersWithWritePermissions.splice(index, 1);
                    }
                }
                cloud.save(next);
            }
        });
    } catch (err) {
        log.error(err);
        return next(err);
    }
};


module.exports = {
    userIsCloudMember: userIsCloudMember,
    userHasWritePermissionInCloud: userHasWritePermissionInCloud,
    checkAndCreateCloudMemberLists: checkAndCreateCloudMemberLists,
    addCloudMember: addCloudMember,
    addCloudMemberWithWritePermissions: addCloudMemberWithWritePermissions,
    removeCloudMember: removeCloudMember,
    removeCloudMemberWritePermissions: removeCloudMemberWritePermissions
};