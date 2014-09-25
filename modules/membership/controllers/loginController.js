var log = require('fooforms-logging').LOG;
var Membership = require('fooforms-membership');
var db = require('mongoose').connection;
var membership = new Membership(db);

exports.login = function (req, res, next) {
    "use strict";

    membership.login(req.body, function (err, result) {
        log.info(err);
        log.info(result);
        if (err) {
            return next(err);
        }
        if(result.success) {
            res.send(result);
        } else {
            res.status(401).json(result);
        }
    });

};
