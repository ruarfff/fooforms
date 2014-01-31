/*jslint node: true */
'use strict';

var authentication = require(global.config.apps.AUTHENTICATION);
var userlib = require(global.config.apps.USER);


/**
 * Create new user
 */
exports.create = function (req, res) {

    var userDetails = {
        displayName: req.displayName,
        name: {
            familyName: req.familyName,
            givenName: req.givenName,
            middleName: req.middleName
        },
        email: req.email,
        password: req.password
    };


    userlib.createUserLocalStrategy(userDetails, function (err, user) {
        if (err) {
            console.log(err.toString());
            return res.render(authentication.signupPath, {
                errors: err.errors,
                user: user
            });
        }
    });
};


