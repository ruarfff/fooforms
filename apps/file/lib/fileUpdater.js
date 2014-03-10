/*jslint node: true */

var File = require('../models/file').File;
var log = require(global.config.apps.LOGGING).LOG;

exports.updateFile = function (fileJson, next) {
    "use strict";
    try {
        File.findByIdAndUpdate(fileJson._id, {
            name: fileJson.name,
            description: fileJson.description,
            sizeKB: fileJson.sizeKB,
            menuLabel: fileJson.menuLabel,
            owner: fileJson.owner
        }, { multi: false }, function (err, file) {
            next(err, file);
        });
    } catch (err) {
        log.error(err.toString());
        next(err, null);
    }

};
