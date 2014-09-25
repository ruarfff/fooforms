"use strict";
var path = require('path');
var modulePath = path.normalize(__dirname + '/../..');
var viewDir = path.join(modulePath, 'membership/views');
var profilePath = path.join( viewDir, 'profile' );
var peoplePath = path.join( viewDir, 'people' );

var express = require('express');
var passport = require('passport');
var router = express.Router();
var log = require('fooforms-logging').LOG;

var userController = require('../controllers/userController');


router.get('', passport.authenticate( 'basic', {session: false} ), function (req, res, next) {
    userController.listByUserName(req, res, next);
});

router.get('/:user', passport.authenticate( 'basic', {session: false} ), function(req, res, next) {
    userController.findUserById(req, res, next);
});

router.get('/partials/profile', passport.authenticate( 'basic', {session: false} ), function (req, res) {
    var user = req.user;

    res.render(profilePath, {
        user: user
    });
});

router.get('/partials/people', passport.authenticate( 'basic', {session: false} ), function (req, res) {
    var user = req.user;

    res.render(peoplePath, {
        user: user
    });

});

router.get('/check/username/:username', function (req, res, next) {
    userController.checkUserName(req, res, next);
});

router.put('/:user', passport.authenticate( 'basic', {session: false} ), function (req, res, next) {
    userController.updateUser(req, res, next);
});

module.exports = router;
