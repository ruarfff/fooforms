/*jslint node: true */
'use strict';

/*jslint node: true */
"use strict";
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

router.get('/partials/standardView', function (req, res) {
    res.render(viewDir + '/dashboard');
});

router.get('/partials/cardView', function (req, res) {
    res.render(viewDir + '/dashboardCard');
});

router.get('/partials/feedView', function (req, res) {
    res.render(viewDir + '/dashboardFeed');
});

router.get('/partials/gridView', function (req, res) {
    res.render(viewDir + '/dashboardGrid');
});

router.get('/partials/userGuide', function (req, res) {
    res.render(viewDir + '/userGuide');
});

router.get('/partials/settings', function (req, res) {
    res.render(viewDir + '/settings');
});

router.get('/user/:user', function (req, res, next) {
    dashboardController.getUserDashboard(req, res, next);
});

module.exports = exports = router;
