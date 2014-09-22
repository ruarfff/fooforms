/*jslint node: true */
'use strict';

/*jslint node: true */
"use strict";
var path = require('path');
var modulePath = path.normalize(__dirname + '/../..');
var viewDir = path.join(modulePath, 'dashboard/views');
var log = require('fooforms-logging').LOG;
var express = require('express');
var router = express.Router();
var assets = require('../../../config/assets');
var dashboardController = require('../controllers/dashboardController');

var router = express.Router();


    router.get('')
        .get(function (req, res) {
            res.render(viewDir + '/index', {
                dev: (process.env.NODE_ENV === 'development'),
                user: req.user || '',
                assets: assets
            });
        });


    router.get('/partials/dashboard', function (req, res, next) {
        res.render(viewDir + '/dashboard');
    });

    router.get('/partials/dashboardCard', function (req, res, next) {
        res.render(viewDir + '/dashboardCard');
    });

    router.get('/partials/dashboardFeed', function (req, res, next) {
        res.render(viewDir + '/dashboardFeed');
    });

    router.get('/partials/dashboardGrid', function (req, res, next) {
        res.render(viewDir + '/dashboardGrid');
    });

    router.get('/partials/userGuide', function (req, res, next) {
            res.render(viewDir + '/userGuide');
        });

    router.get('/partials/settings', function (req, res, next) {
            res.render(viewDir + '/settings');
        });


module.exports = exports = router;
