"use strict";

var express = require('express');
var router = express.Router();
var signupController = require('../controllers/signupController');

router.route('/')
    .all(function (req, res, next) {
        next();
    })
    .get(function (req, res, next) {
        res.status(200).end();
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
module.exports = router;

