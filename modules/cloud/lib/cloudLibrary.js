/*jslint node: true */
'use strict';

var Cloud = require('../models/cloud').Cloud;
var cloudCreator = require('./cloudCreator');
var cloudForms = require('./cloudForms');
var cloudMembers = require('./cloudMembers');
var cloudErrors = require('./cloudErrors');
var cloudDeleter = require('./cloudDeleter');
var cloudQuery = require('./cloudQuery');

module.exports = {
    Cloud: Cloud,
    cloudErrors: cloudErrors,
    createCloud: cloudCreator.createCloud,
    deleteCloudById: cloudDeleter.deleteCloudById,
    updateCloud: cloudForms.updateCloud,
    addFormToCloud: cloudForms.addFormToCloud,
    removeFormFromCloud: cloudForms.removeFormFromCloud,
    getCloudForms: cloudForms.getCloudForms,
    getCloudFormNames: cloudForms.getCloudFormNames,
    copyFormToCLoud: cloudForms.copyFormToCLoud,
    moveFormFromOneCloudToAnother: cloudForms.moveFormFromOneCloudToAnother,
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
