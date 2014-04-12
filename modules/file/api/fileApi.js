/*jslint node: true */
'use strict';
var fileLib = require(global.config.modules.FILE);
var apiUtil = require(global.config.root + '/lib/util/apiUtil');
var log = require(global.config.modules.LOGGING).LOG;


/**
 * Create new file
 */
var createFile = function (req, res) {
    try {
        var body = req.body;
        var fileName = req.files.file.filename;
        var mimeType = req.files.file.mime;
        var fileSize = req.files.file.size;
        var internalName = new ObjectID().toHexString();


        var fileDetails = {
            name: req.files.file.filename,
            internalName: body.description || '',
            icon: body.icon || '',
            mimeType: req.files.file.mime || '',
            owner: req.user.id
        };
        fileLib.createFile(fileDetails, function (err, file) {
            if (err) {
                var responseCode = 500;
                if (err.code === 11000) {
                    err.data = 'A file with that label already exists.';
                    responseCode = 409;
                }
               apiUtil.handleError(res, err, responseCode);
            } else {
                res.status(200);
                res.send(file);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err, 500);
    }
};


var getFileById = function (req, res, id) {
    try {
        fileLib.getFileById(id, function (err, file) {
            if (err || !file) {
                apiUtil.handleError(res, err, 404);
            } else {
                res.status(200);
                res.send(file);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err, 500);
    }
};

var getUserFiles = function (req, res) {
    try {
        fileLib.getUserFiles(req.user.id, function (err, files) {
            if (err || !files) {
                handleError(res, err, 404);
            } else {
                res.status(200);
                res.send(files);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err, 500);
    }
};

// Temporary helper function
var getAllFiles = function (req, res) {
    try {
        fileLib.getAllFiles(function (err, files) {
            if (err || !files) {
                apiUtil.handleError(res, err, 404);
            } else {
                res.status(200);
                res.send(files);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err, 500);
    }
};

var updateFile = function (req, res) {
    try {
        fileLib.updatefile(req.body, function (err, file) {
            if (err || !file) {
                apiUtil.handleError(res, err, 409);
            } else {
                res.status(200);
                res.send(file);
            }
        });
    } catch (err) {
        apiUtil.handleError(res, err, 500);
    }
};

var deleteFile = function (req, res) {
    try {
        var id = req.body._id;
        fileLib.deletefileById(id, function (err, file) {
            if (err) {
                apiUtil.handleError(res, err, 404);
            } else {
                res.send(200);
            }
        });

    } catch (err) {
        apiUtil.handleError(res, err, 500);
    }
};


module.exports = {
    create: createFile,
    getFileById: getFileById,
    getUserFiles: getUserFiles,
    getAllFiles: getAllFiles,
    update: updateFile,
    delete: deleteFile
};





