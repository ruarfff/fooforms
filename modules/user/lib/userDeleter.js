/*jslint node: true */

var User = require('../models/user').User;
var log = require(global.config.modules.LOGGING).LOG;

exports.deleteUserById = function (id, next) {
    "use strict";
    try {
        User.findById(id, function (err, user) {
            if (err) {
                next(err, user);
            }

            user.remove(function (err, user) {
                if (err) {
                    next(err, user);
                }
                User.findById(user._id, function (err, userThatShouldBeNull) {
                    if (userThatShouldBeNull) {
                        err.http_code = 500;
                        err.data = 'Error deleting user';
                    }
                    next(err, userThatShouldBeNull);
                });

            });
        });
    } catch (err) {
        log.error(err);
        next(err);
    }

};
