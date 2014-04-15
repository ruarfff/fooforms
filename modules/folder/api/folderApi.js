/*jslint node: true */
'use strict';
var folderLib = require(global.config.modules.FOLDER);
var log = require(global.config.modules.LOGGING).LOG;
var apiUtil = require(global.config.modules.APIUTIL);


/**
 * Create a new folder using details in request body
 *
 * @param req
 * @param res
 */
var createFolder = function (req, res) {
    try {
        var body = req.body;
        var folderDetails = {
            name: body.name,
            owner: req.user.id,
            menuLabel: body.menuLabel || '',
            description: body.description || '',
            icon: body.icon || '',
            isPrivate: body.isPrivate || false
        };
        folderLib.createFolder(folderDetails, function (err, folder) {
            if (err) {
                if (err.code === 11000) {
                    err.data = 'A folder with that label already exists.';
                    err.http_code = 409;
                }
                apiUtil.handleError(res, err);
            } else {
                res.status(200);
                res.send(folder);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err, __filename);
    }
};

/**
 * Fetch a folder using the Mongo ObjectId string
 *
 * @param req
 * @param res
 * @param id
 */
var getFolderById = function (req, res, id) {
    try {
        folderLib.getFolderById(id, function (err, folder) {
            if (err || !folder) {
                apiUtil.handleError(res, err, 404);
            } else {
                res.status(200);
                res.send(folder);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

/**
 * Get all folders owned by a user
 *
 * @param req
 * @param res
 */
var getUserFolders = function (req, res) {
    try {
        folderLib.getUserFolders(req.user.id, function (err, folders) {
            if (err || !folders) {
                apiUtil.handleError(res, err, 404);
            } else {
                res.status(200);
                res.send(folders);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

/**
 * Update some folder details using data in the request body
 *
 * @param req
 * @param res
 */
var updateFolder = function (req, res) {
    try {
        folderLib.updateFolder(req.body, function (err, folder) {
            if (err || !folder) {
                apiUtil.handleError(res, err, 409);
            } else {
                res.status(200);
                res.send(folder);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

/**
 * Delete a folder referenced by the Mongo Object Id string contained in the request body
 *
 * @param req
 * @param res
 */
var deleteFolder = function (req, res) {
    try {
        var id = req.body._id;
        folderLib.deleteFolderById(id, function (err, folder) {
            if (err) {
                apiUtil.handleError(res, err, 404);
            } else {
                res.send(200);
            }
        });

    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

/**
 * Add a form, referenced by Id, to the folder, also referenced by Id.
 * This will remove a form from whatever folder it is in before this.
 *
 * @param folderId
 * @param formId
 * @param req
 * @param res
 */
var addFormToFolder = function (folderId, formId, req, res) {
    try {
        folderLib.addFormToFolder(folderId, formId, function (err, folder) {
            if (err || !folder) {
                var errorCode = 409;
                if(!folder) {
                    errorCode = 404;
                }
                apiUtil.handleError(res, err, errorCode);
            } else {
                res.status(200);
                res.send(folder);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

/**
 *
 * @param folderId
 * @param formId
 * @param req
 * @param res
 */
var removeFormFromFolder = function (folderId, formId, req, res) {
    try {
        folderLib.removeFormFromFolder(folderId, formId, function (err, folder) {
            if (err || !folder) {
                var errorCode = 409;
                if(!folder) {
                    errorCode = 404;
                }
                apiUtil.handleError(res, err, errorCode);
            } else {
                res.status(200);
                res.send(folder);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

/**
 * Add a member with read permissions to a folder
 *
 * @param folderId
 * @param userId
 * @param req
 * @param res
 */
var addMember = function(folderId, userId, req, res) {
    try {
        folderLib.addFolderMember(folderId, userId, function (err, folder) {
            if (err || !folder) {
                apiUtil.handleError(res, err, 409);
            } else {
                res.status(200);
                res.send(folder);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

/**
 * Add a member or update an existing member with write permissions for the folder.
 *
 * @param folderId
 * @param userId
 * @param req
 * @param res
 */
var addMemberWithWritePermissions = function (folderId, userId, req, res) {
    try {
        folderLib.addFolderMemberWithWritePermissions(folderId, userId, function (err, folder) {
            if (err || !folder) {
                apiUtil.handleError(res, err, 409);
            } else {
                res.status(200);
                res.send(folder);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

/**
 * Completely remove a member from a folder.
 *
 * @param folderId
 * @param userId
 * @param req
 * @param res
 */
var removeMember = function (folderId, userId, req, res) {
    try {
        folderLib.removeFolderMember(folderId, userId, function (err, folder) {
            if (err || !folder) {
                apiUtil.handleError(res, err, 409);
            } else {
                res.status(200);
                res.send(folder);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err);
    }
};

/**
 * Remove a members write permissions from a folder while leaving write permissions.
 *
 * @param folderId
 * @param userId
 * @param req
 * @param res
 */
var removeMemberWritePermissions = function (folderId, userId, req, res) {
    try {
        folderLib.removeFolderMemberWritePermissions(folderId, userId, function (err, folder) {
            if (err || !folder) {
                apiUtil.handleError(res, err, 409);
            } else {
                res.status(200);
                res.send(folder);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err, __filename);
    }
};

var copyFormToFolder;

var moveFormFromOneFolderToAnother;

var getFolderFormNames;

var getFolderForms;

var getFolderByName;


module.exports = {
    create: createFolder,
    getFolderById: getFolderById,
    getUserFolders: getUserFolders,
    update: updateFolder,
    delete: deleteFolder,
    addFormToFolder: addFormToFolder,
    removeFormFromFolder: removeFormFromFolder,
    addMember: addMember,
    addMemberWithWritePermissions: addMemberWithWritePermissions,
    removeMember: removeMember,
    removeMemberWritePermissions: removeMemberWritePermissions
};





