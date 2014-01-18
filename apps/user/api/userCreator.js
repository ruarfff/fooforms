/*jslint node: true */
'use strict';

var authentication = require('../../authentication/lib');
var User = require('../models/user').User;
var userCreator = require('../lib/userCreator');


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


