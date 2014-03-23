/*jslint node: true */
'use strict';

var Cloud = require('../models/cloud').Cloud;
var cloudCreator = require('./cloudCreator');
var cloudApps = require('./cloudApps');
var cloudMembers = require('./cloudMembers');
var cloudErrors = require('./cloudErrors');
var cloudDeleter = require('./cloudDeleter');
var cloudQuery = require('./cloudQuery');

module.exports = {
    Cloud: Cloud,
    cloudErrors: cloudErrors,
    createCloud: cloudCreator.createCloud,
    deleteCloudById: cloudDeleter.deleteCloudById,
    updateCloud: cloudApps.updateCloud,
    addAppToCloud: cloudApps.addAppToCloud,
    removeAppFromCloud: cloudApps.removeAppFromCloud,
    getCloudApps: cloudApps.getCloudApps,
    getCloudAppNames: cloudApps.getCloudAppNames,
    getCloudById: cloudQuery.getCloudById,
    getAllClouds: cloudQuery.getAllClouds,
    getUserClouds: cloudQuery.getUserClouds,
    getCloudByName: cloudQuery.getCloudByName,
    getCloudOwner: cloudQuery.getCloudOwner,
    addCloudMember: cloudMembers.addCloudMember,
    addCloudMemberWithWritePermissions: cloudMembers.addCloudMemberWithWritePermissions,
    removeCloudMember: cloudMembers.removeCloudMember,
    removeCloudMemberWritePermissions: cloudMembers.removeCloudMemberWritePermissions,
    userIsCloudMember: cloudMembers.userIsCloudMember,
    userHasWritePermissionInCloud: cloudMembers.userHasWritePermissionInCloud,
    checkAndCreateCloudMemberLists: cloudMembers.checkAndCreateCloudMemberLists,
    getCloudMembers: cloudMembers.getCloudMembers,
    getCloudMembersWithWritePermissions: cloudMembers.getCloudMembersWithWritePermissions
};
