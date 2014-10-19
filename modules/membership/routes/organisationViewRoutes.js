/*jslint node: true */
'use strict';
var path = require('path');
var viewDir = path.join(__dirname, '../views');
var express = require('express');
var router = express.Router();

router.get('/partials/organisations', function (req, res) {
    res.render(path.join(viewDir, 'organisations'));
});

router.get('/partials/organisation-profile', function (req, res) {
    res.render(path.join(viewDir, 'organisation-profile'));
});

module.exports = router;
