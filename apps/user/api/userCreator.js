/*jslint node: true */
'use strict';

var authentication = require(global.config.apps.AUTHENTICATION);
var userCreator = require( global.config.apps.USER );


/**
 * Create new user
 */
exports.create = function (req, res) {
    userCreator.createUserLocalStrategy(req.body, function (err, user) {
        if (err) {
            console.log(err.toString());
            return res.render(authentication.signupPath, {
                errors: err.errors,
                user: user
            });
        }
    });
};


