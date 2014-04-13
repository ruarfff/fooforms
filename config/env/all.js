/*jslint node: true */
'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../..');
var modulesPath = path.join(rootPath, 'modules');
var utilDir = path.join(rootPath, 'lib/util');

/* Convenience paths to modules and other components */
var adminDir = path.join(modulesPath, 'admin');
var formDir = path.join(modulesPath, 'form');
var authenticationDir = path.join(modulesPath, 'authentication');
var folderDir = path.join(modulesPath, 'folder');
var dashboardDir = path.join(modulesPath, 'dashboard');
var databaseDir = path.join(modulesPath, 'database');
var loggingDir = path.join(modulesPath, 'logging');
var userDir = path.join(modulesPath, 'user');
var formBuilderDir = path.join(modulesPath, 'formBuilder');
var formViewerDir = path.join(modulesPath, 'formViewer');
var calendarDir = path.join(modulesPath, 'calendar');
var fileDir = path.join(modulesPath, 'file');
var apiUtilDir = path.join(utilDir, 'apiUtil');

/**
 * Enumerator to allow easy access to absolute module root paths.
 */
var modules = {
    "ADMIN": adminDir,
    "FORM": formDir,
    "AUTHENTICATION": authenticationDir,
    "FOLDER": folderDir,
    "DASHBOARD": dashboardDir,
    "DATABASE": databaseDir,
    "LOGGING": loggingDir,
    "USER": userDir,
    "FORMBUILDER": formBuilderDir,
    "FORMVIEWER": formViewerDir,
    "CALENDAR": calendarDir,
    "FILE": fileDir,
    "APIUTIL": apiUtilDir
};

module.exports = {
    root: rootPath,
    port: process.env.PORT || 3000,
    modules: modules
};

