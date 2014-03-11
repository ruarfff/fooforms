var path = require('path');

var rootPath = path.normalize(__dirname + '/../..');

/* Convenience paths to apps and other components */
var adminDir = path.join(rootPath, 'apps/admin');
var appDir = path.join(rootPath, 'apps/app');
var authenticationDir = path.join(rootPath, 'apps/authentication');
var cloudDir = path.join(rootPath, 'apps/cloud');
var dashboardDir = path.join(rootPath, 'apps/dashboard');
var databaseDir = path.join(rootPath, 'apps/database');
var loggingDir = path.join(rootPath, 'apps/logging');
var userDir = path.join(rootPath, 'apps/user');
var appBuilderDir = path.join(rootPath, 'apps/appBuilder');
var appViewerDir = path.join(rootPath, 'apps/appViewer');
var calendarDir = path.join(rootPath, 'apps/calendar');
var fileDir = path.join(rootPath, 'apps/file');

/**
 * Enumerator to allow easy access to absolute application root paths.
 */
var apps = {
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
    "FILE": fileDir
};

module.exports = {
    root: rootPath,
    port: process.env.PORT || 3000,
    apps: apps
};

