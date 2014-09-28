"use strict";
var path = require('path');
var viewDir = path.join(__dirname, '../views');
var signupPath = path.join( viewDir, 'signup' );

var express = require('express');
var router = express.Router();
var signupController = require('../controllers/signupController');

router.route('/')
    .all(function (req, res, next) {
        next();
    })
    .get(function (req, res, next) {
        res.render(signupPath, {
            title: 'Sign up',
            error: ''
        });
    })
    .put(function (req, res, next) {
        next(new Error('not implemented'));
    })
    .post(function (req, res, next) {
        signupController.signup(req, res, next);
    })
    .delete(function (req, res, next) {
        next(new Error('not implemented'));
    });

router.get('/check/username/:username',
    function (req, res, next) {
        signupController.checkUserName(req, res, next);
    });


module.exports = router;

