var Membership = require('fooforms-membership');
var mongoose = require('mongoose');

exports.signup = function (req, res, next) {
    "use strict";

    var membership = new Membership(mongoose);

    membership.register(req.body, function (err, result) {
        console.log(result);
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
