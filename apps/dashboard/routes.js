/*jslint node: true */
'use strict';

var path = require('path');
var viewDir = path.join(global.config.apps.DASHBOARD, 'views');
var authLib = require(global.config.apps.AUTHENTICATION);

var routes = function (app) {

    app.get('/partials/dashboard', authLib.ensureAuthenticated, function (req, res) {
        res.render(viewDir + '/index');
    });

};

module.exports = routes;
