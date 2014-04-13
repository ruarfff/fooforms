/*jslint node: true */

var User = require('../models/user').User;
var async = require("async");
var log = require(global.config.modules.LOGGING).LOG;

exports.deleteUserById = function (id, next) {
    "use strict";
    try {
        User.findById(id, function (err, user) {
            if (err) {
                next(err, user);
            }

            user.remove(function (err, user) {
                if (err) {
                    log.error(__filename, ' - ', err);
                    next(err, user);
                }
                User.findById(user._id, function (err, userThatShouldBeNull) {
                    if (userThatShouldBeNull) {
                        err.http_code = 500;
                        err.data = 'Error deleting user';
                        return next(err);
                    }
                    if(err) {
                        log.error(__filename, ' - ', err);
                    }
                    var folderLib = require(global.config.modules.FOLDER);
                    folderLib.getFolderFolders(user._id, function(err, folders) {
                        if (folders && folders.length > 0) {
                            async.each(folders,
                                function (folder, done) {
                                    folderLib.deleteFolderById(folder._id, function (err) {
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
                            return next(err);
                        }
                    });
                });

            });
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }

};
