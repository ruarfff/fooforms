/*jslint node: true */
'use strict';

var Folder = require('../models/folder').Folder;
var folderCreator = require('./folderCreator');
var folderForms = require('./folderForms');
var folderMembers = require('./folderMembers');
var folderErrors = require('./folderErrors');
var folderDeleter = require('./folderDeleter');
var folderQuery = require('./folderQuery');

module.exports = {
    Folder: Folder,
    folderErrors: folderErrors,
    createFolder: folderCreator.createFolder,
    deleteFolderById: folderDeleter.deleteFolderById,
    updateFolder: folderForms.updateFolder,
    addFormToFolder: folderForms.addFormToFolder,
    removeFormFromFolder: folderForms.removeFormFromFolder,
    getFolderForms: folderForms.getFolderForms,
    getFolderFormNames: folderForms.getFolderFormNames,
    copyFormToFolder: folderForms.copyFormToFolder,
    moveFormFromOneFolderToAnother: folderForms.moveFormFromOneFolderToAnother,
    getFolderById: folderQuery.getFolderById,
    getAllFolders: folderQuery.getAllFolders,
    getUserFolders: folderQuery.getUserFolders,
    getFolderByName: folderQuery.getFolderByName,
    getFolderOwner: folderQuery.getFolderOwner,
    addFolderMember: folderMembers.addFolderMember,
    addFolderMemberWithWritePermissions: folderMembers.addFolderMemberWithWritePermissions,
    removeFolderMember: folderMembers.removeFolderMember,
    removeFolderMemberWritePermissions: folderMembers.removeFolderMemberWritePermissions,
    userIsFolderMember: folderMembers.userIsFolderMember,
    userHasWritePermissionInFolder: folderMembers.userHasWritePermissionInFolder,
    checkAndCreateFolderMemberLists: folderMembers.checkAndCreateFolderMemberLists,
    getFolderMembers: folderMembers.getFolderMembers,
    getFolderMembersWithWritePermissions: folderMembers.getFolderMembersWithWritePermissions
};
