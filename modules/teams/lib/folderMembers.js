/*jslint node: true */
"use strict";

var Folder = require('../models/folder').Folder;
var log = require('fooforms-logging').LOG;

/**
 * Checks a folder to see if the user id corresponds to any folder membership
 * including Folder Owner, Folder Member or Folder Member with write permissions.
 *
 * @param folder - Folder document
 * @param user - User to check if is a member
 * @returns {*}
 */
var userIsFolderMember = function (folder, userId) {
    try {
        return (
            folder.owner.equals(userId) ||
            (folder.members && (folder.members.indexOf(userId) > -1))
            );
    } catch (err) {
        log.error(__filename, ' - ', err);
    }
    return false;
};

/**
 * Checks that a User has write permissions for this Folder.
 *
 * @param folder - Folder document
 * @param user - User to check for write permissions
 * @returns {*}
 */
var userHasWritePermissionInFolder = function (folder, userId) {
    try {
        return (
            folder.owner.equals(userId) ||
            (folder.membersWithWritePermissions && (folder.membersWithWritePermissions.indexOf(userId) > -1))
            );
    } catch (err) {
        log.error(__filename, ' - ', err);
    }
    return false;
};

/**
 * Checks that Folder member lists have been initialized and initializes them if not.
 *
 * @param folder - Folder document
 * @returns {*}
 */
var checkAndCreateFolderMemberLists = function (folder) {
    if (!folder.membersWithWritePermissions) {
        folder.membersWithWritePermissions = [];
    }
    if (!folder.members) {
        folder.members = [];
    }
    return folder;
};

/**
 * Add a user to the Folder members list
 *
 * @param folderId - The objectId of the folder that will have the member added to it
 * @param userId - The objectId of the user to be added to the folders members list
 * @param next - Callback. Gets passed err and folder
 * @returns {*}
 */
var addFolderMember = function (folderId, userId, next) {
    try {
        Folder.findById(folderId, function (err, folder) {
            if (err) {
                return next(err);
            }
            if (!folder) {
                return next(new Error('Could not find folder with id: ' + folderId));
            }
            if (folder.isUserFolder) {
                return next(new Error('Cannot add members to a user folder'), folder);
            }

            if (folder.owner.equals(user._id)) {
                return next(new Error('User cannot be made a member of folder because user with id ' + user._id + ' is the folder owner'));
            }
            if (userIsFolderMember(folder, user)) {
                return next(new Error('User with id ' + user._id + ' is already a folder member'));
            }
            folder.members.push(user._id);
            folder.save(next);

        });

    } catch (err) {
        return next(err);
    }
};

/**
 * Grant a user write permissions for a folder. If the user is not already a member, they will be added to
 * the members list.
 *
 * @param folderId - The objectId of the folder that will have the member added to it
 * @param userId - The objectId of the user to be added to the folders members list
 * @param next - Callback. Gets passed err and folder
 * @returns {*}
 */
var addFolderMemberWithWritePermissions = function (folderId, userId, next) {
    try {
        Folder.findById(folderId, function (err, folder) {
            if (err) {
                return next(err);
            }
            if (!folder) {
                return next(new Error('Could not find folder with id: ' + folderId));
            }
            if (folder.isUserFolder) {
                return next(new Error('Cannot add members to a User Folder'), folder);
            }

            if (folder.owner.equals(userId)) {
                return next(new Error('User cannot be made a member of folder because user with id ' + userId + ' is the folder owner'));
            }
            if (userHasWritePermissionInFolder(folder, user)) {
                return next(new Error('User with id ' + userId + 'already has write permissions for folder with id ' + folder._id));
            }
            if (userIsFolderMember(folder, user)) {
                folder.membersWithWritePermissions.push(userId);
                folder.save(next);
            } else {
                folder.members.push(user._id);
                folder.membersWithWritePermissions.push(userId);
                folder.save(next);

            }
        });
    } catch (err) {
        return next(err);
    }
};

/**
 * Remove a user from the folder members list.
 * If the user is in the write permissions list they will be removed from
 * that also.
 *
 * @param folderId - The objectId of the folder that will have the member added to it
 * @param userId - The objectId of the user to be added to the folders members list
 * @param next - Callback. Gets passed err and folder
 * @returns {*}
 */
var removeFolderMember = function (folderId, userId, next) {
    try {
        Folder.findById(folderId, function (err, folder) {
            if (err) {
                return next(err);
            }
            if (!folder) {
                return next(new Error('Could not find folder with id: ' + folderId));
            }
            if (folder.owner.equals(userId)) {
                return next(new Error('Cannot remove folder owner from folder members'));
            }
            var index = -1;
            if (folder.members) {
                index = folder.members.indexOf(userId);
                if (index > -1) {
                    folder.members.pull(userId);
                }
            }
            if (folder.membersWithWritePermissions) {
                index = folder.membersWithWritePermissions.indexOf(userId);
                if (index > -1) {
                    folder.membersWithWritePermissions.pull(userId);
                }
            }
            folder.save(next);
        });
    } catch (err) {
        return next(err);
    }
};

/**
 * Remove a user from a folders write permissions list but keep them in the members list.
 *
 * @param folderId - The objectId of the folder that will have the member added to it
 * @param userId - The objectId of the user to be added to the folders members list
 * @param next - Callback. Gets passed err and folder
 * @returns {*}
 */
var removeFolderMemberWritePermissions = function (folderId, userId, next) {
    try {
        Folder.findById(folderId, function (err, folder) {
            if (err) {
                return next(err);
            }
            if (!folder) {
                return next(new Error('Could not find folder with id: ' + folderId));
            }
            if (folder.owner.equals(userId)) {
                return next(new Error('Cannot remove write permissions of folder owner'));
            }
            if (!userIsFolderMember(folder, userId)) {
                return next(new Error('User with Id ' + userId + ' is not a folder member'));
            }
            else if (!userHasWritePermissionInFolder(folder, userId)) {
                return next(new Error('User with Id ' + userId + ' does not have write permissions'));
            } else {
                var index = -1;
                if (folder.membersWithWritePermissions) {
                    index = folder.membersWithWritePermissions.indexOf(userId);
                    if (index > -1) {
                        folder.membersWithWritePermissions.splice(index, 1);
                    }
                }
                folder.save(next);
            }
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        return next(err);
    }
};

var getFolderMembers = function (folderId, next) {
    try {
        Folder.findById(folderId).populate('members').exec(function (err, folder) {
            next(err, folder.members);
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        return next(err);
    }
};

var getFolderMembersWithWritePermissions = function (folderId, next) {
    try {
        Folder.findById(folderId).populate('membersWithWritePermissions').exec(function (err, folder) {
            next(err, folder.membersWithWritePermissions);
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        return next(err);
    }
};


module.exports = {
    userIsFolderMember: userIsFolderMember,
    userHasWritePermissionInFolder: userHasWritePermissionInFolder,
    checkAndCreateFolderMemberLists: checkAndCreateFolderMemberLists,
    addFolderMember: addFolderMember,
    addFolderMemberWithWritePermissions: addFolderMemberWithWritePermissions,
    removeFolderMember: removeFolderMember,
    removeFolderMemberWritePermissions: removeFolderMemberWritePermissions,
    getFolderMembers: getFolderMembers,
    getFolderMembersWithWritePermissions: getFolderMembersWithWritePermissions
};
