/*jslint node: true */
'use strict';
var path = require('path');
var viewDir = path.join(global.config.apps.ADMIN, 'views');
var authenticator = require(global.config.apps.AUTHENTICATION);

var routes = function (app) {

    app.get('/partials/admin', authenticator.ensureLoggedIn, function (req, res) {
        res.render(viewDir + '/index', {
            user: req.user,
            uptime: process.uptime(),
            arch: process.arch,
            platform: process.platform,
            nodeVersion: process.version
        });
    });

};

module.exports = routes;
