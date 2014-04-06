/*jslint node: true */
var File = require('../models/file').File;
var log = require(global.config.apps.LOGGING).LOG;

exports.getFileById = function (id, next) {
    "use strict";
    try {
        File.findById(id, function (err, file) {
            next(err, file);
        });
    } catch (err) {
        log.error(err.toString());
        next(err, null);
    }
};

exports.getAllFiles = function (next) {
    "use strict";
    try {
        File.find({}, function (err, file) {
            next(err, file);
        });
    } catch (err) {
        log.error(err.toString());
        next(err, null);
    }
};

exports.getUserFiles = function (userId, next) {
    "use strict";
    try {
        File.find({ owner: userId }, function (err, files) {
            next(err, files);
        });
    } catch (err) {
        log.error(err.toString());
        next(err, null);
    }
};