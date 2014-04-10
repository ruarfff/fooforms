/*jslint node: true */

var File = require('../models/file').File;
var log = require(global.config.modules.LOGGING).LOG;

exports.deleteFileById = function (id, next) {
    "use strict";
    try {
        File.findById(id, function (err, file) {
            if (err) {
                next(err, file);
            } else {
                file.remove(function (err, file) {
                    if (err) {
                        next(err, file);
                    } else {
                        File.findById(file._id, function (err, fileThatShouldBeNull) {
                            if (fileThatShouldBeNull) {
                                err.code = 500;
                                err.data = 'Error deleting file';
                            }
                            next(err, fileThatShouldBeNull);
                        });
                    }
                });
            }
        });
    } catch (err) {
        log.error(err.toString());
        next(err, null);
    }

};
