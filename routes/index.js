/*
 * GET home page.
 */

exports.index = function (req, res) {
    var db = require('../apps/database/database');
    var util = require('util');


    var t1 = typeof OPENSHIFT_APP_DNS;
    var t2 = typeof OPENSHIFT_APP_NAME;
    var t3 = typeof OPENSHIFT_APP_UUID;

    res.render('index',
        {
            title: 'FooForms',
            dbConnected: db.connected,
            dbErrorMessage: db.errorMessage || 'No error message available',
            uptime: process.uptime(),
            arch: process.arch,
            platform: process.platform,
            nodeVersion: process.version,
            isOpenShift: (typeof OPENSHIFT_APP_NAME !== 'undefined'),
            test1: t1,
            test2: t2,
            test3: t3
        }
    );
};