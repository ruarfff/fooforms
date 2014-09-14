/*jslint node: true */
"use strict";

var Folder = require('../models/folder').Folder;
var log = require('fooforms-logging').LOG;

var getFolderById = function (id, next) {
    try {
        Folder.findById(id, function (err, folder) {
            next(err, folder);
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

var getFolderByName = function (name, next) {
    try {
        Folder.findByName(name, next);
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

var getAllFolders = function (next) {
    try {
        Folder.find({}, function (err, folder) {
            next(err, folder);
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

var getFolderOwner = function (folderId, next) {
    try {
        Folder.findById(folderId).populate('owner').exec(function (err, folder) {
            next(err, folder.owner);
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        return next(err);
    }
};

/**
 * Get all Folders owned by a particular user
 *
 * @param userId
 * @param next
 */
var getUserFolders = function (userId, next) {
    try {
        Folder.findByOwner(userId, function (err, folders) {
            next(err, folders);
        });
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

module.exports = {
    getFolderById: getFolderById,
    getFolderByName: getFolderByName,
    getAllFolders: getAllFolders,
    getFolderOwner: getFolderOwner,
    getUserFolders: getUserFolders
};
