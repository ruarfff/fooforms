var Membership = require('fooforms-membership');
var mongoose = require('mongoose');

exports.login = function (req, res, next) {
    "use strict";

    var membership = new Membership(mongoose);

    membership.login(req.body, function (err, result) {
        console.log(err);
        console.log(result);
        if (err) {
            return next(err);
        }
        if(result.success) {
            res.send(result);
        } else {
            res.status(401).send(result);
        }
    });

};