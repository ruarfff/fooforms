/*jslint node: true */
'use strict';

var path = require('path');
var viewDir = path.join(global.config.modules.DASHBOARD, 'views');
var authLib = require(global.config.modules.AUTHENTICATION);

var routes = function (app, passport) {

    app.get('/partials/dashboard', authLib.ensureLoggedIn, function (req, res) {
        res.render(viewDir + '/index');
    });

};

module.exports = routes;
