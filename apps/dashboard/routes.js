/*jslint node: true */
'use strict';

var config = require('../../config/config');
var viewDir = config.root + '/apps/dashboard/views';
var authenticator = require('../authentication/lib/authenticator');

var routes = function (app) {

    app.get('/dashboard', authenticator.ensureAuthenticated, function (req, res) {
        res.render(viewDir + '/index', {
            user: req.user,
            title: 'Dashboard'
        });
    });

};

module.exports = routes;
