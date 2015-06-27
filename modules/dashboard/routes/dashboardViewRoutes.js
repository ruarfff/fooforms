/*jslint node: true */
'use strict';
var path = require('path');
var appRoot = require('app-root-path');
var viewDir = path.join(__dirname, '../views');
var express = require('express');
var router = express.Router();
var recursive = require('recursive-readdir');
var log = require('fooforms-logging').LOG;
var _ = require('underscore');

router.get('', function (req, res) {
    var assets = [];
    if ((process.env.NODE_ENV === 'development')) {
        // Livereload the dashboard while in dev mode
        assets.push('//localhost:35729/livereload.js');
        recursive(appRoot + '/client/app', ['.DS_Store'], function (err, files) {
            if (err) {
                log.error(err);
                throw(err);
            }
            files = _.map(files, function (file) {
                return file.replace(appRoot, '');
            });
            log.debug(files);

            res.render(viewDir + '/index', {
                user: req.user || '',
                assets: assets.concat(files)
            });

        });
    } else {
        assets.push('/js/main.min.js');
        res.render(viewDir + '/index', {
            user: req.user || '',
            assets: assets
        });
    }
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
