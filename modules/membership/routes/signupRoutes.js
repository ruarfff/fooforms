"use strict";
var express = require('express');
var router = express.Router();
var signupController = require('../controllers/signupController');

router.route('/')
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

