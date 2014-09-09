"use strict";

var express = require('express');
var router = express.Router();

var passport = require('passport');
//var loginController = require('../controllers/loginController');

router.route('/')
    .all(function (req, res, next) {
        next();
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

