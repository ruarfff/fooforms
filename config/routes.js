/*jslint node: true */
'use strict';

var authenticator = require(global.config.apps.AUTHENTICATION);

/**
 * Main configuration for all routes in application.
 * Any apps that are added should initialize their routes here.
 * @param app - The express object
 * @param passport - Passport object for authenticator
 */
var routes = function (app, passport) {

    app.get('/', function (req, res) {
        res.render('index');
    });

    app.get('/dashboard', authenticator.ensureAuthenticated, function (req, res) {
        res.render('dashboard', {
            user: req.user
        });
    });

    require('../apps/admin/routes')(app);
    require('../apps/app/routes')(app);
    require('../apps/authentication/routes')(app, passport);
    require('../apps/cloud/routes')(app);
    require('../apps/dashboard/routes')(app);
    require('../apps/database/routes')(app);
    require('../apps/user/routes')(app);
    require('../apps/appBuilder/routes')(app);

    app.get('*', function (req, res) {
        res.render('dashboard', {
            user: req.user
        });
    });

};

module.exports = routes;
