/*jslint node: true */
'use strict';
var fileLib = require('../lib/fileLibrary');
var errorResponseHandler = require('fooforms-rest').errorResponseHandler;
var log = require('fooforms-logging').LOG;
var fs = require('fs');
var path = require('path');
var rootPath = path.normalize(__dirname + '/../../..');

var bucket = require('../googleCloud');

/**
 * Create new file
 */
var createFile = function (req, res) {
    try {
        var originalName = req.files.file.name;
        var internalName = req.user._id + '/' + fileLib.makeFileName() + path.extname(originalName);
        var icon = req.body.icon || '';
        var mimeType = req.files.file.type || '';

        fs.createReadStream(req.files.file.path)
            .pipe(bucket.createWriteStream(internalName))
            .on('error', function (err) {
                errorResponseHandler.handleError(res, err, __filename);
            })
            .on('complete', function (fileObject) {
                fileObject.originalName = originalName;
                fileObject.icon = icon;
                fileObject.mimeType = mimeType;
                fileObject.fileId = fileObject.id;
                fileLib.createFile(fileObject, function (err, file) {
                    if (err) {
                        errorResponseHandler.handleError(res, err, __filename);
                    } else {
                        res.status(200);
                        res.send(file);
                    }
                });
            });
    } catch (err) {
        errorResponseHandler.handleError(res, err, __filename);
    }
};


var getFileById = function (req, res) {
    try {
        var id = req.params.file;
        fileLib.getFileById(id, function (err, file) {
            if (err || !file) {
                if (!err) {
                    new Error('file not found');
                }
                err.http_code = 404;
                errorResponseHandler.handleError(res, err, __filename);
            } else {
                res.setHeader("Content-Type", file.mimeType || file.contentType);

                bucket.getSignedUrl({
                    action: 'read',
                    expires: Math.round(Date.now() / 1000) + (60 * 60 * 24), // 1 day.
                    resource: file.name
                }, function (err, url) {
                    res.redirect(url);

                });
                /**bucket.createReadStream(file.name)
                 .pipe(res)
                 .on('error', function(err) {
                        errorResponseHandler.handleError(res, err, __filename);
                    });**/
            }
        });
    } catch (err) {
        errorResponseHandler.handleError(res, err, __filename);
    }
};

var getUserFiles = function (req, res) {
    try {
        fileLib.getUserFiles(req.user.id, function (err, files) {
            if (err || !files) {
                if (!err) {
                    new Error('file not found');
                }
                err.http_code = 404;
                errorResponseHandler.handleError(res, err, __filename);
            } else {
                res.status(200);
                res.send(files);
            }
        });
    } catch (err) {
        errorResponseHandler.handleError(res, err, __filename);
    }
};

// Temporary helper function
var getAllFiles = function (req, res) {
    try {
        fileLib.getAllFiles(function (err, files) {
            if (err || !files) {
                if (!err) {
                    new Error('file not found');
                }
                err.http_code = 404;
                errorResponseHandler.handleError(res, err, __filename);
            } else {
                res.status(200);
                res.send(files);
            }
        });
    } catch (err) {
        errorResponseHandler.handleError(res, err, __filename);
    }
};

var updateFile = function (req, res) {
    try {
        fileLib.updateFile(req.body, function (err, file) {
            if (err || !file) {
                if (!err) {
                    new Error('could not update file');
                }
                err.http_code = 409;
                errorResponseHandler.handleError(res, err, __filename);
            } else {
                res.status(200);
                res.send(file);
            }
        });
    } catch (err) {
        errorResponseHandler.handleError(res, err, __filename);
    }
};

var deleteFile = function (req, res) {
    try {
        var id = req.body._id;
        fileLib.deleteFileById(id, function (err, file) {
            if (err) {
                errorResponseHandler.handleError(res, err, __filename);
            } else {
                res.send(200);
            }
        });

    } catch (err) {
        errorResponseHandler.handleError(res, err, __filename);
    }
};

var importFile = function (req, res) {
    try {


        fileLib.importFile(req.files.file, function (err, file) {
            if (err) {
                if (err.code === 11000) {
                    err.data = 'Error Parsing the CSV File.';
                    err.http_code = 409;
                }
                errorResponseHandler.handleError(res, err, __filename);
            } else {
                res.status(200);
                res.send(file);
            }
        });
    } catch (err) {
        errorResponseHandler.handleError(res, err, __filename);
    }
};


module.exports = {
    create: createFile,
    getFileById: getFileById,
    getUserFiles: getUserFiles,
    getAllFiles: getAllFiles,
    update: updateFile,
    delete: deleteFile,
    import: importFile
};





