/*jslint node: true */
'use strict';
var folderLib = require(global.config.modules.FOLDER);
var log = require('fooforms-logging').LOG;
var errorResponseHandler = require('fooforms-rest').errorResponseHandler;


/**
 * Create new folder
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
                errorResponseHandler.handleError(res, err);
            } else {
                res.status(200);
                res.send(folder);
            }
        });
    } catch (err) {
        errorResponseHandler.handleError(res, err, __filename);
    }
};


var getFolderById = function (req, res, id) {
    try {
        folderLib.getFolderById(id, function (err, folder) {
            if (err || !folder) {
                if(!err) {err = new Error('folder not found');}
                err.http_code = 404;
                errorResponseHandler.handleError(res, err, __filname);
            } else {
                res.status(200);
                res.send(folder);
            }
        });
    } catch (err) {
        errorResponseHandler.handleError(res, err);
    }
};

var getUserFolders = function (req, res) {
    try {
        folderLib.getUserFolders(req.user.id, function (err, folders) {
            if (err || !folders) {
                if(!err) {err = new Error('folder not found');}
                err.http_code = 404;
                errorResponseHandler.handleError(res, err);
            } else {
                res.status(200);
                res.send(folders);
            }
        });
    } catch (err) {
        errorResponseHandler.handleError(res, err);
    }
};

// Temporary helper function
var getAllFolders = function (req, res) {
    try {
        folderLib.getAllFolders(function (err, folders) {
            if (err || !folders) {
                if(!err) {err = new Error('folder not found');}
                err.http_code = 404;
                errorResponseHandler.handleError(res, err);
            } else {
                res.status(200);
                res.send(folders);
            }
        });
    } catch (err) {
        errorResponseHandler.handleError(res, err);
    }
};

var updateFolder = function (req, res) {
    try {
        folderLib.updateFolder(req.body, function (err, folder) {
            if (err || !folder) {
                if(!err) {err = new Error('could not update folder');}
                err.http_code = 409;
                errorResponseHandler.handleError(res, err);
            } else {
                res.status(200);
                res.send(folder);
            }
        });
    } catch (err) {
        errorResponseHandler.handleError(res, err);
    }
};

var deleteFolder = function (req, res) {
    try {
        var id = req.body._id;
        folderLib.deleteFolderById(id, function (err, folder) {
            if (err) {
                if(!err) {err = new Error('could not delete folder');}
                err.http_code = 409;
                errorResponseHandler.handleError(res, err);
            } else {
                res.send(200);
            }
        });

    } catch (err) {
        errorResponseHandler.handleError(res, err);
    }
};

var addFormToFolder = function (folderId, formId, req, res) {
    try {
        folderLib.addFormToFolder(folderId, formId, function (err, folder) {
            if (err || !folder) {
                if(!err) {err = new Error('could not add form to folder');}
                err.http_code = 409;
                if(!folder) {
                    err.http_code = 404;
                }
                errorResponseHandler.handleError(res, err);
            } else {
                res.status(200);
                res.send(folder);
            }
        });
    } catch (err) {
        errorResponseHandler.handleError(res, err);
    }
};

var removeFormFromFolder = function (folderId, formId, req, res) {
    try {
        folderLib.removeFormFromFolder(folderId, formId, function (err, folder) {
            if (err || !folder) {
                if(!err) {err = new Error('could not add remove form from folder');}
                err.http_code = 409;
                if(!folder) {
                    err.http_code = 404;
                }
                errorResponseHandler.handleError(res, err);
            } else {
                res.status(200);
                res.send(folder);
            }
        });
    } catch (err) {
        errorResponseHandler.handleError(res, err);
    }
};

var addMember = function(folderId, userId, req, res) {
    try {
        folderLib.addFolderMember(folderId, userId, function (err, folder) {
            if (err || !folder) {
                if(!err) {err = new Error('could not add member to folder');}
                err.http_code = 409;
                if(!folder) {
                    err.http_code = 404;
                }
                errorResponseHandler.handleError(res, err);
            } else {
                res.status(200);
                res.send(folder);
            }
        });
    } catch (err) {
        errorResponseHandler.handleError(res, err);
    }
};

var addMemberWithWritePermissions = function (folderId, userId, req, res) {
    try {
        folderLib.addFolderMemberWithWritePermissions(folderId, userId, function (err, folder) {
            if (err || !folder) {
                if(!err) {err = new Error('could not add memebr with writer permissions to folder');}
                err.http_code = 409;
                if(!folder) {
                    err.http_code = 404;
                }
                errorResponseHandler.handleError(res, err);
            } else {
                res.status(200);
                res.send(folder);
            }
        });
    } catch (err) {
        errorResponseHandler.handleError(res, err);
    }
};

var removeMember = function (folderId, userId, req, res) {
    try {
        folderLib.removeFolderMember(folderId, userId, function (err, folder) {
            if (err || !folder) {
                if(!err) {err = new Error('could not remove member from folder');}
                err.http_code = 409;
                if(!folder) {
                    err.http_code = 404;
                }
                errorResponseHandler.handleError(res, err);
            } else {
                res.status(200);
                res.send(folder);
            }
        });
    } catch (err) {
        errorResponseHandler.handleError(res, err);
    }
};

var removeMemberWritePermissions = function (folderId, userId, req, res) {
    try {
        folderLib.removeFolderMemberWritePermissions(folderId, userId, function (err, folder) {
            if (err || !folder) {
                if(!err) {err = new Error('could not remove form memeber write permisisons from folder');}
                err.http_code = 409;
                if(!folder) {
                    err.http_code = 404;
                }
                errorResponseHandler.handleError(res, err);
            } else {
                res.status(200);
                res.send(folder);
            }
        });
    } catch (err) {
        errorResponseHandler.handleError(res, err, __filename);
    }
};


module.exports = {
    create: createFolder,
    getFolderById: getFolderById,
    getUserFolders: getUserFolders,
    getAllFolders: getAllFolders,
    update: updateFolder,
    delete: deleteFolder,
    addFormToFolder: addFormToFolder,
    removeFormFromFolder: removeFormFromFolder,
    addMember: addMember,
    addMemberWithWritePermissions: addMemberWithWritePermissions,
    removeMember: removeMember,
    removeMemberWritePermissions: removeMemberWritePermissions
};





