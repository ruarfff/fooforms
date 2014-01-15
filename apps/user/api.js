/*jslint node: true */
'use strict';

var authentication = require('../authentication/lib');
var User = require('./models/user').User;
var userLib = require('./lib')


/**
 * Create new user
 */
exports.create = function (req, res) {
    userLib.createUserLocalStrategy(req.body, function (err, user) {
        if (err) {
            console.log(err.toString());
            return res.render(authentication.signupPath, {
                errors: err.errors,
                user: user
            });
        }
    });
};

/**
 * Send current logged in user
 */
exports.me = function (req, res) {
    res.jsonp(userLib.userProfile(req.user) || null);
};

/**
 * Update user
 */
exports.updateUser = function (req, res) {
    try {
        var updatedUser = req.body;

        var query = { _id: updatedUser.id };

        User.findOneAndUpdate(query, updatedUser, {upsert: false, "new": false}).exec(
            function (err, user) {
                if (!err) {
                    console.log("updated " + user.displayName);
                } else {
                    res.statusCode = 400;
                    console.log(err);
                }
                res.send(user);
            });
    } catch (err) {
        res.statusCode = 400;
        res.send(err);
    }
};

/**
 * Find user by id
 */
exports.user = function (req, res, next, id) {

};
