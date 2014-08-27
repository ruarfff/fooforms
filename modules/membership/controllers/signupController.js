var Membership = require('fooforms-membership');

exports.signup = function (req, res, next) {
    "use strict";

    var membership = new Membership();

    membership.register(req.body, function (err, result) {
        console.log(result);
        if(err) {
            next(err);
        }
        res.send(result);
    });
};