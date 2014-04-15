/*jslint node: true */

var File = require('../models/file').File;
var log = require(global.config.modules.LOGGING).LOG;

exports.createFile = function (fileJSON, next) {
    "use strict";
    try {
        var file = new File(fileJSON);
        file.save(function (err) {
            next(err, file);
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err, null);
    }

};
