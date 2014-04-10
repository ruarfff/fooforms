/*jslint node: true*/
"use strict";

var userLib = require(global.config.modules.USER);
var authLib = require(global.config.modules.AUTHENTICATION);
var log = require(global.config.modules.LOGGING).LOG;
var _ = require('underscore');

exports.signup = function (req, res) {
    try {
        var body = req.body;
        var displayName = body.displayName;
        var email = body.email;
        var password = body.password;
        var verification = body.verification;

        var userDetails = {
            displayName: displayName,
            email: email,
            password: password,
            name: {
                firstName: body.firstName,
                middleName: body.middleName,
                familyName: body.familyName
            }
        };

        log.debug(JSON.stringify(userDetails));

        var error = null;
        // regexp from https://github.com/angular/angular.js/blob/master/src/ng/directive/input.js#L4
        var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;

        // check for valid inputs
        if (!displayName || !email || !password || !verification) {
            error = 'All fields are required';
        } else if (displayName !== encodeURIComponent(displayName)) {
            error = 'Username may not contain any non-url-safe characters';
        } else if (!email.match(EMAIL_REGEXP)) {
            error = 'Email is invalid';
        } else if (password !== verification) {
            error = 'Passwords don\'t match';
        }

        if (error) {
            log.error(error);
            res.status(403);
            res.render(authLib.signupPath, {
                title: 'Sign Up',
                error: error
            });
            return;
        }

        // check if username is already taken
        userLib.checkDisplayName(displayName, function (err, user) {
                if (user) {
                    if (!_.isArray(user) || user.length > 0) {
                        res.status(403);
                        res.render(authLib.signupPath, {
                            title: 'Sign Up',
                            error: 'Username is already taken'
                        });
                        return;
                    }
                }
                if (err) {
                    log.error(err);
                    res.status(500);
                    return res.render(authLib.signupPath, { title: 'Sign Up', error: err.message });
                }

                userLib.createUser(userDetails, function (err, user) {
                    if (err || !user) {
                        log.error(err.toString());
                        res.status(500);
                        return res.render(authLib.signupPath, { title: 'Sign Up', error: err.message });
                    }

                    res.redirect('/login');

                });
            }
        )
        ;
    }
    catch
        (err) {
        log.error(err);
        res.status(500);
        res.render(authLib.signupPath, {
            title: 'Sign Up',
            error: err.message
        });
    }
}
;
