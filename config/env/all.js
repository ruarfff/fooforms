var path = require( 'path' );

var rootPath = path.normalize(__dirname + '/../..');

var devDbConfig = {
    "hostname": 'localhost',
    "port": '27017',
    "username": "",
    "password": "",
    "name": "",
    "db": "test"
};

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
    "APPBUILDER": appBuilderDir
};

var mainLayoutPath = path.join(rootPath, 'views/layouts/globalLayout.html');

var layouts = {
    "MAIN": mainLayoutPath
};

module.exports = {
    root: rootPath,
    port: process.env.PORT || 3000,
    database: devDbConfig,
    apps: apps,
    layouts: layouts
}

