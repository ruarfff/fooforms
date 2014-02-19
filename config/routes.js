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
    require('../apps/calendar/routes')(app);
    require('../apps/database/routes')(app);
    require('../apps/user/routes')(app);
    require('../apps/appBuilder/routes')(app);

    app.get('/partials/userGuide', authenticator.ensureAuthenticated, function (req, res) {
        res.render('userGuide', {
            user: req.user
        });
    });

    app.get('/partials/settings', authenticator.ensureAuthenticated, function (req, res) {
        res.render('settings', {
            user: req.user
        });
    });

    app.get('/404', function (req, res) {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not found'
        });
    });

    app.get('*', function (req, res) {
        res.render('dashboard', {
            user: req.user
        });
    });

};

module.exports = routes;
