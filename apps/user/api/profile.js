/*jslint node: true */
'use strict';

var User = require('../models/user').User;
var userProfile = require('../lib/profile')


/**
 * Send current logged in user
 */
exports.me = function (req, res) {
    res.jsonp(userProfile.userToProfile(req.user) || null);
};

/**
 * Update user profile
 */
exports.updateProfile = function (req, res) {
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
