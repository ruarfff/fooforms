/*jslint node: true */
'use strict';
var fileLib = require(global.config.modules.FILE);
var errorResponseHandler = require('fooforms-rest').errorResponseHandler;
var log = require('fooforms-logging').LOG;
var fs = require('fs');

var apiUtil = require(global.config.root + '/lib/util/apiUtil');


/**
 * Create new file
 */
var createFile = function (req, res) {
    try {
        var internalName = fileLib.makeFileName();

        var fileDetails = {
            name: req.files.file.name,
            internalName: internalName,
            icon: req.body.icon || '',
            mimeType: req.files.file.type || '',
            owner: req.user.id
        };

        fs.readFile(req.files.file.path, function (err, data) {

            var newPath =global.config.root +'/uploads/'+ internalName;
            fs.writeFile(newPath, data, function (err) {
                if (err){
                    res.json(err);
                }else{
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
                }
            });
        });
    } catch (err) {
        errorResponseHandler.handleError(res, err, __filename);
    }
};


var getFileById = function (req, res, id) {
    try {
        fileLib.getFileById(id, function (err, file) {
            if (err || !file) {
                if(!err){new Error('file not found');}
                err.http_code = 404;
                errorResponseHandler.handleError(res, err, __filename);
            }else {
                var filePath =global.config.root +'/uploads/'+ file.internalName;
                fs.readFile(filePath, function (err, data) {
                    if (err){
                        res.sendfile(img404);
                    }else{
                        res.setHeader("Content-Type", file.mimeType);
                        res.writeHead(200);
                        res.end(data);
                    }
                });


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
                if(!err){new Error('file not found');}
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
                if(!err){new Error('file not found');}
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
                if(!err){new Error('could not update file');}
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





