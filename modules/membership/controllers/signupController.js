var Membership = require('fooforms-membership');
var db = require('mongoose').connection;

exports.signup = function (req, res, next) {
    "use strict";

    var membership = new Membership(db);

    membership.register(req.body, function (err, result) {
        if (err) {
            return next(err);
        }
        if(result.success) {
            res.send(result);
        } else {
            res.status(400).send(result);
        }

    });
};
