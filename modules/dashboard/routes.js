/*jslint node: true */
'use strict';

var path = require('path');
var viewDir = path.join(global.config.modules.DASHBOARD, 'views');

var routes = function (app, passport) {

    app.route('/dashboard')
        .get(function (req, res) {
            res.render(viewDir + '/index', {
                dev: (process.env.NODE_ENV === 'development'),
                user: req.user || ''
            });
        });


    app.get('/partials/dashboard', passport.authenticate('basic', { session: false }), function (req, res) {
        res.render(viewDir + '/dashboard');
    });

    app.get('/partials/dashboardCard', passport.authenticate('basic', { session: false }), function (req, res) {
        res.render(viewDir + '/dashboardCard');
    });

    app.get('/partials/dashboardFeed', passport.authenticate('basic', { session: false }), function (req, res) {
        res.render(viewDir + '/dashboardFeed');
    });

    app.get('/partials/dashboardGrid', passport.authenticate('basic', { session: false }), function (req, res) {
        res.render(viewDir + '/dashboardGrid');
    });

    app.route('/partials/userGuide')
        .get(passport.authenticate( 'basic', { session: false } ), function (req, res) {
            res.render(viewDir + '/userGuide');
        });

    app.route('/partials/settings')
        .get(passport.authenticate( 'basic', { session: false } ), function (req, res) {
            res.render(viewDir + '/settings');
        });

};

module.exports = routes;
