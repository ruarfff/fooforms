/*jslint node: true */
'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../..');
var modulesPath = path.join(rootPath, 'modules');
var utilDir = path.join(rootPath, 'lib/util');

/* Convenience paths to modules and other components */
var adminDir = path.join(modulesPath, 'admin');
var appDir = path.join(modulesPath, 'app');
var authenticationDir = path.join(modulesPath, 'authentication');
var cloudDir = path.join(modulesPath, 'cloud');
var dashboardDir = path.join(modulesPath, 'dashboard');
var databaseDir = path.join(modulesPath, 'database');
var loggingDir = path.join(modulesPath, 'logging');
var userDir = path.join(modulesPath, 'user');
var appBuilderDir = path.join(modulesPath, 'appBuilder');
var appViewerDir = path.join(modulesPath, 'appViewer');
var calendarDir = path.join(modulesPath, 'calendar');
var fileDir = path.join(modulesPath, 'file');
var apiUtilDir = path.join(utilDir, 'apiUtil');

/**
 * Enumerator to allow easy access to absolute application root paths.
 */
var modules = {
    "ADMIN": adminDir,
    "APP": appDir,
    "AUTHENTICATION": authenticationDir,
    "CLOUD": cloudDir,
    "DASHBOARD": dashboardDir,
    "DATABASE": databaseDir,
    "LOGGING": loggingDir,
    "USER": userDir,
    "APPBUILDER": appBuilderDir,
    "APPVIEWER": appViewerDir,
    "CALENDAR": calendarDir,
    "FILE": fileDir,
    "APIUTIL": apiUtilDir
};

module.exports = {
    root: rootPath,
    port: process.env.PORT || 3000,
    modules: modules
};

