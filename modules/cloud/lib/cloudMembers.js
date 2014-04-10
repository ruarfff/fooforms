/*jslint node: true */
"use strict";

var Cloud = require('../models/cloud').Cloud;
var User = require(global.config.modules.USER).User;
var log = require(global.config.modules.LOGGING).LOG;

/**
 * Checks a cloud to see if the user id corresponds to any cloud membership
 * including Cloud Owner, Cloud Member or Cloud Member with write permissions.
 *
 * @param cloud - Cloud document
 * @param user - User to check if is a member
 * @returns {*}
 */
var userIsCloudMember = function (cloud, user) {
    try {
        return (
            cloud.owner.equals(user._id) ||
            (cloud.members && (cloud.members.indexOf(user._id) > -1)) &&
            (user.cloudMemberships && (user.cloudMemberships.indexOf(cloud._id) > -1))
            );
    } catch (err) {
        log.error(err);
    }
    return false;
};

/**
 * Checks that a User has write permissions for this Cloud.
 *
 * @param cloud - Cloud document
 * @param user - User to check for write permissions
 * @returns {*}
 */
var userHasWritePermissionInCloud = function (cloud, user) {
    try {
        return (
            cloud.owner.equals(user._id) ||
            (cloud.membersWithWritePermissions && (cloud.membersWithWritePermissions.indexOf(user._id) > -1)) &&
            (user.cloudMemberships && (user.cloudMemberships.indexOf(cloud._id) > -1))
            );
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
            if (err) return next(err);
            if (!cloud) return next(new Error('Could not find cloud with id: ' + cloudId));
            if (cloud.isUserCloud) return next(new Error('Cannot add members to a User CLoud'), cloud);

            User.findById(userId, function (err, user) {
                if (err) return next(err);
                if (!user) return next(new Error('Could not add user to cloud because user with id: ' + user._id + ' does not exist in the database'));

                checkAndCreateCloudMemberLists(cloud);

                if (cloud.owner.equals(user._id)) {
                    return next(new Error('User cannot be made a member of cloud because user with id ' + user._id + ' is the cloud owner'));
                }
                if (userIsCloudMember(cloud, user)) {
                    return next(new Error('User with id ' + user._id + ' is already a cloud member'))
                }
                user.addCloudMembership(cloud._id, function (err, user) {
                    cloud.members.push(user._id);
                    cloud.save(next);
                });
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
            if (err) return next(err);
            if (!cloud) return next(new Error('Could not find cloud with id: ' + cloudId));
            if (cloud.isUserCloud) return next(new Error('Cannot add members to a User CLoud'), cloud);

            User.findById(userId, function (err, user) {
                if (err) return next(err);
                if (!user) return next(new Error('Could not add user to cloud because user with id: ' + user._id + ' does not exist in the database'));
                checkAndCreateCloudMemberLists(cloud);
                if (cloud.owner.equals(user._id)) {
                    return next(new Error('User cannot be made a member of cloud because user with id ' + user._id + ' is the cloud owner'));
                }
                if (userHasWritePermissionInCloud(cloud, user)) {
                    return next(new Error('User with id ' + user._id + 'already has write permissions for cloud with id ' + cloud._id));
                }
                if (userIsCloudMember(cloud, user)) {
                    cloud.membersWithWritePermissions.push(user._id);
                    cloud.save(next);
                } else {
                    user.addCloudMembership(cloud._id, function (err, user) {
                        cloud.members.push(user._id);
                        cloud.membersWithWritePermissions.push(user._id);
                        cloud.save(next);
                    });
                }
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
            if (err) return next(err);
            if (!cloud) return next(new Error('Could not find cloud with id: ' + cloudId));
            if (cloud.owner.equals(userId)) return next(new Error('Cannot remove cloud owner from cloud members'));
            User.findById(userId, function (err, user) {
                if (err) return next(err);
                if (!userIsCloudMember(cloud, user)) {
                    return next(new Error('User with Id ' + user._id + ' is not a cloud member'));
                } else {
                    user.removeCloudMembership(cloud._id, function (err, user) {
                        if (err) return next(err);
                        var index = -1;
                        if (cloud.members) {
                            index = cloud.members.indexOf(user._id);
                            if (index > -1) {
                                cloud.members.pull(user._id);
                            }
                        }
                        if (cloud.membersWithWritePermissions) {
                            index = cloud.membersWithWritePermissions.indexOf(user._id);
                            if (index > -1) {
                                cloud.membersWithWritePermissions.pull(user._id);
                            }
                        }
                        cloud.save(next);
                    });
                }
            });
        });
    } catch (err) {
        return next(err);
    }
};

/**
 * Remove a user from a clouds write permissions list but keep them in the members list.
 *
 * @param cloudId - The objectId of the cloud that will have the member added to it
 * @param userId - The objectId of the user to be added to the clouds members list
 * @param next - Callback. Gets passed err and cloud
 * @returns {*}
 */
var removeCloudMemberWritePermissions = function (cloudId, userId, next) {
    try {
        Cloud.findById(cloudId, function (err, cloud) {
            if (err) return next(err);
            if (!cloud) return next(new Error('Could not find cloud with id: ' + cloudId));
            if (cloud.owner.equals(userId)) return next(new Error('Cannot remove write permissions of cloud owner'));
            User.findById(userId, function (err, user) {
                if (err) return next(err);
                if (!user) return next(new Error('Could not find user with id: ' + userId));

                if (!userIsCloudMember(cloud, user)) {
                    return next(new Error('User with Id ' + user._id + ' is not a cloud member'));
                }
                else if (!userHasWritePermissionInCloud(cloud, user)) {
                    return next(new Error('User with Id ' + user._id + ' does not have write permissions'));
                } else {
                    var index = -1;
                    if (cloud.membersWithWritePermissions) {
                        index = cloud.membersWithWritePermissions.indexOf(user._id);
                        if (index > -1) {
                            cloud.membersWithWritePermissions.splice(index, 1);
                        }
                    }
                    cloud.save(next);
                }
            });
        });
    } catch (err) {
        log.error(err);
        return next(err);
    }
};

var getCloudMembers = function (cloudId, next) {
    try {
        Cloud.findById(cloudId).populate('members').exec(function (err, cloud) {
            next(err, cloud.members);
        });
    } catch (err) {
        log.error(err);
        return next(err);
    }
};

var getCloudMembersWithWritePermissions = function (cloudId, next) {
    try {
        Cloud.findById(cloudId).populate('membersWithWritePermissions').exec(function (err, cloud) {
            next(err, cloud.membersWithWritePermissions);
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
    removeCloudMemberWritePermissions: removeCloudMemberWritePermissions,
    getCloudMembers: getCloudMembers,
    getCloudMembersWithWritePermissions: getCloudMembersWithWritePermissions
};