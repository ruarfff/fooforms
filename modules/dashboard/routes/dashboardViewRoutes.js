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

router.get('/partials/main-view',
    function (req, res) {
        res.render(viewDir + '/partials/dashboard');
    });

router.get('/partials/print-view',
    function (req, res) {
        res.render(viewDir + '/partials/singlePost');
    });

router.get('/partials/userGuide', function (req, res) {
    res.render(viewDir + '/userGuide');
});


module.exports = router;
