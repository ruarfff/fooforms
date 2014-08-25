"use strict";

var express = require('express');
var router = express.Router();
var signupController = require('../controllers/signupController');
var Membership = require('fooforms-membership');
var mongoose = require('mongoose');

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
        var membership = new Membership(mongoose);

        membership.register(req.body, function (err, result) {
            if (err) {
                return next(err);
            }
            return res.send(result);
        });
    })
    .delete(function (req, res, next) {
        next(new Error('not implemented'));
    });
module.exports = router;

