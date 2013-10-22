var config = require('../../config/config');
var viewDir = config.root + '/apps/dev/views';
var routes = function (app) {

    app.get('/', function (req, res) {
        res.render(viewDir + '/index');
    });

    app.get('/status', function (req, res) {
        // Temporarily showing a status page until proper development starts
        var db = require('../database/database');

        res.render(viewDir + '/status',
            {
                title: "FooForms Status",
                dbConnected: db.connected,
                dbErrorMessage: db.errorMessage || "No error message available",
                uptime: process.uptime(),
                arch: process.arch,
                platform: process.platform,
                nodeVersion: process.version,
                isOpenShift: (typeof process.env.OPENSHIFT_APP_NAME !== "undefined"),
                openshiftAppDns: process.env.OPENSHIFT_APP_DNS || "Unknown",
                openshiftAppName: process.env.OPENSHIFT_APP_NAME || "Unknown",
                openshiftAppUUID: process.env.OPENSHIFT_APP_UUID || "Unknown",
                openshiftMongoHost: process.env.OPENSHIFT_MONGODB_DB_HOST || "Unknown",
                openshiftMongoPort: process.env.OPENSHIFT_MONGODB_DB_PORT || "Unknown",
                openshiftNodeIp: process.env.OPENSHIFT_NODEJS_IP || "Unknown",
                openshiftNodePort: process.env.OPENSHIFT_NODEJS_PORT || "Unknown"
            }
        );
    });


};

module.exports = routes;