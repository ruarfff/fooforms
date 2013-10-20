/*
 * GET home page.
 */

exports.index = function (req, res) {
    var db = require('../apps/database/database');
    var util = require('util');

    res.render('index',
        {
            title: 'FooForms',
            dbConnected: db.connected,
            dbErrorMessage: db.errorMessage || 'No error message available',
            uptime: process.uptime(),
            arch: process.arch,
            platform: process.platform,
            nodeVersion: process.version,
            isOpenShift: (typeof OPENSHIFT_APP_NAME !== 'undefined')
        }
    );
};