exports.index = function (req, res) {
    var db = require('../apps/database/database');
    var util = require('util');

    res.render('index',
        {
            title: "FooForms",
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
};