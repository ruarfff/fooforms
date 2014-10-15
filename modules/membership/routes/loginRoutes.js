"use strict";
var log = require('fooforms-logging').LOG;
var path = require('path');
var viewDir = path.join(__dirname, '../views');
var loginPath = path.join(viewDir, 'login');

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
    .post(function (req, res, next) {
        passport.authenticate('basic', { session: false }, function (err, user, info) {
            if (err) {
                return next(err);
            }

            if (!user) {
                var result = {
                    message: 'We could not find your user name or password'
                };
                return res.status(401).json(result);
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.status(200).end();
            });
        })
        (req, res, next)
    })
    .delete(function (req, res, next) {
        next(new Error('not implemented'));
    });
module.exports = router;


