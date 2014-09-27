/*jslint node: true */
'use strict';

/*jslint node: true */
"use strict";
var passport = require('passport');
var path = require('path');
var modulePath = path.normalize(__dirname + '/../..');
var viewDir = path.join(modulePath, 'dashboard/views');
var log = require('fooforms-logging').LOG;
var express = require('express');
var assets = require('../../../config/assets');
var dashboardController = require('../controllers/dashboardController');

var router = express.Router();


router.get('', function (req, res) {
    res.render(viewDir + '/index', {
        dev: (process.env.NODE_ENV === 'development'),
        user: req.user || '',
        assets: assets
    });
});

router.get('/partials/standardView', passport.authenticate('basic', { session: false }), function (req, res) {
    res.render(viewDir + '/dashboard');
});

router.get('/partials/cardView', passport.authenticate('basic', { session: false }), function (req, res) {
    res.render(viewDir + '/dashboardCard');
});

router.get('/partials/feedView', passport.authenticate('basic', { session: false }), function (req, res) {
    res.render(viewDir + '/dashboardFeed');
});

router.get('/partials/gridView', passport.authenticate('basic', { session: false }), function (req, res) {
    res.render(viewDir + '/dashboardGrid');
});

router.get('/partials/organisations', passport.authenticate('basic', { session: false }), function (req, res) {
    res.render(viewDir + '/organisations');
});

router.get('/partials/teams', passport.authenticate('basic', { session: false }), function (req, res) {
    res.render(viewDir + '/teams');
});

router.get('/user/:user', function (req, res, next) {
    dashboardController.getUserDashboard(req, res, next);
});

module.exports = exports = router;
