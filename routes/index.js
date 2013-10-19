/*
 * GET home page.
 */

exports.index = function (req, res) {
    var db = require('../apps/database/database');
    var util = require('util');

    res.render('index',
        {
            title: 'FooForms',
            connected: db.connected,
            uptime: process.uptime(),
            arch: process.arch,
            platform: process.platform,
            nodeVersion: process.version,
        }
    );
};