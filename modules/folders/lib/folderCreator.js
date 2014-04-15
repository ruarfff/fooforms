/*jslint node: true */

var Folder = require('../models/folder').Folder;
var log = require(global.config.modules.LOGGING).LOG;

exports.createFolder = function (folderJSON, next) {
    "use strict";
    try {
        var _folder = new Folder(folderJSON);
        _folder.save(next);
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err, null);
    }

};
