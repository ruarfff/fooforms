/*jslint node: true */
'use strict';
var path = require('path');
var viewDir = path.join(__dirname, '../views');
var express = require('express');
var router = express.Router();

var profilePath = path.join(viewDir, 'profile');
var peoplePath = path.join(viewDir, 'people');

router.get('/partials/profile',
    function (req, res) {
        res.render(profilePath);
    });

router.get('/partials/people',
    function (req, res) {
        res.render(peoplePath);
    });

module.exports = router;
