/*jslint node: true */

var Folder = require('../models/folder').Folder;
var log = require(global.config.modules.LOGGING).LOG;
var async = require("async");

exports.deleteFolderById = function (id, next) {
    "use strict";
    try {
        Folder.findById(id).populate('forms').exec(function (err, folder) {
            if (err) {
                log.error(__filename, ' - ', err);
                return next(err, folder);
            }
            var folderForms = folder.forms;
            folder.remove(function (err, folder) {
                if (err) {
                    log.error(__filename, ' - ', err);
                    return next(err, folder);
                }
                Folder.findById(folder._id, function (err, folderThatShouldBeNull) {
                    if (folderThatShouldBeNull && !err) {
                        err.http_code = 500;
                        err.data = 'Error deleting folder';
                    }
                    if (err) {
                        log.error(__filename, ' - ', err);
                        return next(err);
                    }
                    if (folderForms && folderForms.length > 0) {
                        var formLib = require(global.config.modules.FORM);
                        async.each(folderForms,
                            function (form, done) {
                                formLib.deleteFormById(form._id, function (err) {
                                    if (err) {
                                        log.error(__filename, ' - ', err);
                                    }
                                    return done();
                                });
                            },
                            function (err) {
                                next(err);
                            }
                        );
                    } else {
                        return next();
                    }
                });
            });
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }

};
