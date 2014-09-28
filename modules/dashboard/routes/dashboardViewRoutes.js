/*jslint node: true */
'use strict';
var path = require('path');
var viewDir = path.join(__dirname, '../views');
var express = require('express');
var assets = require('../../../config/assets');
var router = express.Router();

router.get('', function (req, res) {
    res.render(viewDir + '/index', {
        dev: (process.env.NODE_ENV === 'development'),
        user: req.user || '',
        assets: assets
    });
});

router.get('/partials/standardView',
    function (req, res) {
        res.render(viewDir + '/dashboard');
    });

router.get('/partials/cardView',
    function (req, res) {
        res.render(viewDir + '/dashboardCard');
    });

router.get('/partials/feedView',
    function (req, res) {
        res.render(viewDir + '/dashboardFeed');
    });

router.get('/partials/gridView', function (req, res) {
    res.render(viewDir + '/dashboardGrid');
});

router.get('/partials/userGuide', function (req, res) {
    res.render(viewDir + '/userGuide');
});


module.exports = router;
