/*jslint node: true */
'use strict';

var config = require('../../config/config');
var viewDir = config.root + '/apps/dev/views';
var db = require('../database/lib/databaseGateway');
var authenticator = require('../authentication/lib/authenticator');

var routes = function (app) {

    app.get('/admin', authenticator.ensureAuthenticated, function (req, res) {
        res.render(viewDir + '/index', {
            user: req.user,
            title: 'Admin'
        });
    });

    app.get('/admin/api', authenticator.ensureAuthenticated, function (req, res) {
        res.render(viewDir + '/api');
    });

    app.get('/admin/status', authenticator.ensureAuthenticated, function (req, res) {
        res.render(viewDir + '/status',
            {
                title: config.app.name,
                dbConnected: db.connected,
                dbErrorMessage: db.errorMessage || "No error message available",
                uptime: process.uptime(),
                arch: process.arch,
                platform: process.platform,
                nodeVersion: process.version
            }
        );
    });
};

module.exports = routes;
