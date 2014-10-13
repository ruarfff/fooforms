"use strict";
var express = require('express');
var passport = require('passport');
var router = express.Router();
var log = require('fooforms-logging').LOG;

var userController = require('../controllers/userController');

router.get('',
    function (req, res, next) {
        userController.listByUserName(req, res, next);
    });

router.get('/:user',
    function (req, res, next) {
        userController.findUserById(req, res, next);
    });

router.get('/check/me',
    function (req, res) {
        res.json({ _id: req.user._id, displayName: req.user.displayName, photo: req.user.photo });
    });

router.put('/:user',
    function (req, res, next) {
        userController.updateUser(req, res, next);
    });

module.exports = router;
