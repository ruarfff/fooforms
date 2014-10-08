/*jslint node: true */
'use strict';
var path = require('path');
var viewDir = path.join(__dirname, '../views');
var express = require('express');
var router = express.Router();

router.get('/partials/admin', function (req, res) {
    res.render(viewDir + '/index', {
        user: req.user,
        uptime: process.uptime(),
        arch: process.arch,
        platform: process.platform,
        nodeVersion: process.version
    });
});

module.exports = router;
