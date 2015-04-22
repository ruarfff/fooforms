"use strict";
var log = require('fooforms-logging').LOG;
var Membership = require('fooforms-membership');
var db = require('mongoose').connection;
var email = require('../lib/emails');
var async = require('async');

var express = require('express');
var router = express.Router();

router.route('/')
    .post(function (req, res) {
        var token = req.body.token;
        var newPassword = req.body.password;

        async.waterfall([
            function (done) {

                if (!newPassword) {
                    done(new Error('Password cannot be empty.'), 'done');
                }

                var membership = new Membership(db);

                membership.User.findOne({
                    resetPasswordToken: token
                }, function (err, user) {
                    if (!user) {
                        err = err || new Error('User not found');
                        done(err, 'done');
                    } else {
                        user.password = membership.passwordUtil.encryptPassword(newPassword, user.salt);
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(function (err) {
                            if (!err) {
                                res.status(200).send();
                            }

                            done(err, user)
                        });
                    }
                });
            },
            function (user, done) {
                var emailArgs = {user: user};

                email.sendUpdatedPasswordEmail(emailArgs, function (err) {
                    done(err, 'done');
                });
            }
        ], function (err) {
            if (err) {
                log.error(err);
                res.status(404).send('Password reset token is invalid or has expired.');
            }
        });
    });

module.exports = router;