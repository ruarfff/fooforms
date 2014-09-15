/*jslint node: true */
"use strict";

var Folder = require('../models/folder').Folder;
var User = require(global.config.modules.USER).User;
var log = require('fooforms-logging').LOG;

/**
 * Checks a folder to see if the user id corresponds to any folder membership
 * including Folder Owner, Folder Member or Folder Member with write permissions.
 *
 * @param folder - Folder document
 * @param user - User to check if is a member
 * @returns {*}
 */
var userIsFolderMember = function (folder, user) {
    try {
        return (
            folder.owner.equals(user._id) ||
            (folder.members && (folder.members.indexOf(user._id) > -1)) &&
            (user.folderMemberships && (user.folderMemberships.indexOf(folder._id) > -1))
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
var userHasWritePermissionInFolder = function (folder, user) {
    try {
        return (
            folder.owner.equals(user._id) ||
            (folder.membersWithWritePermissions && (folder.membersWithWritePermissions.indexOf(user._id) > -1)) &&
            (user.folderMemberships && (user.folderMemberships.indexOf(folder._id) > -1))
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

            User.findById(userId, function (err, user) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return next(new Error('Could not add user to folder because user with id: ' + user._id + ' does not exist in the database'));
                }

                checkAndCreateFolderMemberLists(folder);

                if (folder.owner.equals(user._id)) {
                    return next(new Error('User cannot be made a member of folder because user with id ' + user._id + ' is the folder owner'));
                }
                if (userIsFolderMember(folder, user)) {
                    return next(new Error('User with id ' + user._id + ' is already a folder member'));
                }
                user.addFolderMembership(folder._id, function (err, user) {
                    folder.members.push(user._id);
                    folder.save(next);
                });
            });
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

            User.findById(userId, function (err, user) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return next(new Error('Could not add user to folder because user with id: ' + user._id + ' does not exist in the database'));
                }
                checkAndCreateFolderMemberLists(folder);
                if (folder.owner.equals(user._id)) {
                    return next(new Error('User cannot be made a member of folder because user with id ' + user._id + ' is the folder owner'));
                }
                if (userHasWritePermissionInFolder(folder, user)) {
                    return next(new Error('User with id ' + user._id + 'already has write permissions for folder with id ' + folder._id));
                }
                if (userIsFolderMember(folder, user)) {
                    folder.membersWithWritePermissions.push(user._id);
                    folder.save(next);
                } else {
                    user.addFolderMembership(folder._id, function (err, user) {
                        folder.members.push(user._id);
                        folder.membersWithWritePermissions.push(user._id);
                        folder.save(next);
                    });
                }
            });
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
            User.findById(userId, function (err, user) {
                if (err) {
                    return next(err);
                }
                if (!userIsFolderMember(folder, user)) {
                    return next(new Error('User is not a folder member'));
                } else {
                    user.removeFolderMembership(folder._id, function (err, user) {
                        if (err) {
                            return next(err);
                        }
                        var index = -1;
                        if (folder.members) {
                            index = folder.members.indexOf(user._id);
                            if (index > -1) {
                                folder.members.pull(user._id);
                            }
                        }
                        if (folder.membersWithWritePermissions) {
                            index = folder.membersWithWritePermissions.indexOf(user._id);
                            if (index > -1) {
                                folder.membersWithWritePermissions.pull(user._id);
                            }
                        }
                        folder.save(next);
                    });
                }
            });
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
            User.findById(userId, function (err, user) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return next(new Error('Could not find user with id: ' + userId));
                }

                if (!userIsFolderMember(folder, user)) {
                    return next(new Error('User with Id ' + user._id + ' is not a folder member'));
                }
                else if (!userHasWritePermissionInFolder(folder, user)) {
                    return next(new Error('User with Id ' + user._id + ' does not have write permissions'));
                } else {
                    var index = -1;
                    if (folder.membersWithWritePermissions) {
                        index = folder.membersWithWritePermissions.indexOf(user._id);
                        if (index > -1) {
                            folder.membersWithWritePermissions.splice(index, 1);
                        }
                    }
                    folder.save(next);
                }
            });
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
