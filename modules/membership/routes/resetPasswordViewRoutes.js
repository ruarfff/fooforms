"use strict";
var log = require('fooforms-logging').LOG;
var path = require('path');
var viewDir = path.join(__dirname, '../views');
var resetPasswordPath = path.join(viewDir, 'reset-password');
var Membership = require('fooforms-membership');
var db = require('mongoose').connection;

var express = require('express');
var router = express.Router();

router.get('/:token', function (req, res, next) {
    var membership = new Membership(db);
    membership.User.findOne({resetPasswordToken: req.params.token}, function (err, user) {
        if (!user) {
            return res.redirect('/404');
        }
        next();
    });
});

router.get('/partials/reset-password', function (req, res) {
    res.render(resetPasswordPath);
});

module.exports = router;