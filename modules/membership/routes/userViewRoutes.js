/*jslint node: true */
'use strict';
var path = require('path');
var viewDir = path.join(__dirname, '../views');
var express = require('express');
var router = express.Router();

var profilePath = path.join(viewDir, 'profile');
var peoplePath = path.join(viewDir, 'people');
var userProfilePath = path.join(viewDir, 'user-profile');
var userProfilePicture = path.join(viewDir, 'user-profile-picture');

router.get('/partials/profile',
    function (req, res) {
        res.render(profilePath);
    });

router.get('/partials/user-profile',
    function (req, res) {
        res.render(userProfilePath);
    });

router.get('/partials/people',
    function (req, res) {
        res.render(peoplePath);
    });

router.get('/partials/user-profile-picture',
    function (req, res) {
        res.render(userProfilePicture);
    });

module.exports = router;
