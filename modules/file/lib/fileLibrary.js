/*jslint node: true */
'use strict';

var File = require('../models/file').File;
var fileNameGen = require('./fileNameGen');
var fileCreator = require('./fileCreator');
var fileImporter = require('./fileImporter');
var fileDeleter = require('./fileDeleter');
var fileUpdater = require('./fileUpdater');
var fileQuery = require('./fileQuery');


module.exports = {
    File: File,
    createFile: fileCreator.createFile,
    deleteFileById: fileDeleter.deleteFileById,
    updateFile: fileUpdater.updateFile,
    getFileById: fileQuery.getFileById,
    getAllFiles: fileQuery.getAllFiles,
    getUserFiles: fileQuery.getUserFiles,
    makeFileName : fileNameGen.makeFileName,
    importFile : fileImporter.importFile
};
