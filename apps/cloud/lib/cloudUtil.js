/*jslint node: true */
var log = require(global.config.apps.LOGGING).LOG;
var _ = require('underscore');

exports.userHasWritePermissionInCloud = function (cloud, userId) {
    "use strict";
    try {
        return (cloud.owner.equals(userId) || (cloud.membersWithWritePermissions && _.contains(cloud.membersWithWritePermissions, userId)));
    } catch (err) {
        log.error(err);
    }
    return false;
};

exports.checkAndCreateCloudMemberLists = function (cloud) {
    if (!cloud.membersWithWritePermissions) {
        cloud.membersWithWritePermissions = [];
    }
    if (!cloud.members) {
        cloud.members = [];
    }
    return cloud;
};