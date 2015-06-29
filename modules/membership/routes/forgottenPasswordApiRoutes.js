"use strict";
var log = require('fooforms-logging').LOG;
var Membership = require('fooforms-membership');
var db = require('mongoose').connection;
var async = require('async');
var crypto = require('crypto');
var email = require('../lib/emails');
var express = require('express');
var router = express.Router();

router.route('/')
    .post(function (req, res, next) {
        async.waterfall([
            function (done) {
                crypto.randomBytes(20, function (err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function (token, done) {
                var membership = new Membership(db);
                membership.findUserByEmail(req.body.email, function (err, result) {
                    if (result && result.data) {
                        var user = result.data;
                        user.resetPasswordToken = token;
                        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour - TODO: not actually using the expiration
                        membership.updateUser(user, function (err, result) {
                            if (!err && result.success) {
                                done(err, token, result.user);
                            } else {
                                log.error('an error occurred updating user ' + user._id + ' for password reset');
                            }
                        });
                    } else {
                        log.error('No user with email ' + req.body.email + ' was found for password reset: ' + err)
                    }
                });
            },
            function (token, user, done) {
                var emailArgs = {url: 'http://' + req.headers.host + '/reset-password/' + token, email: user.email};

                email.sendForgottenPasswordEmail(emailArgs, function (err) {
                    done(err, 'done');
                });

            }
        ], function (err) {
            if (err) return next(err);
            res.status(200).send();
        });
    });

module.exports = router;