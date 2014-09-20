"use strict";
var path = require('path');
var modulePath = path.normalize(__dirname + '/../..');
var viewDir = path.join(modulePath, 'membership/views');
var loginPath = path.join( viewDir, 'login' );

var express = require('express');
var router = express.Router();
var passport = require('passport');


//var loginController = require('../controllers/loginController');

router.route('/')
    .all(function (req, res, next) {
        next();
    })
    .get(function (req, res, next) {

        res.render(loginPath, {
            title: 'Login',
            message: req.flash('error')
        });
    })
    .put(function (req, res, next) {
        next(new Error('not implemented'));
    })
    .post(passport.authenticate('basic', { session: false }), function (req, res) {
        res.send(200);
    })
    .delete(function (req, res, next) {
        next(new Error('not implemented'));
    });
module.exports = router;


