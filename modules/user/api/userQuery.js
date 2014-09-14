/*jslint node: true */
'use strict';
var userLib = require(global.config.modules.USER);
var apiUtil = require(global.config.modules.APIUTIL);
var log = require('fooforms-logging').LOG;

exports.checkUserName = function (req, res) {
    var displayName = req.body.displayName;
    // check if username contains non-url-safe characters
    if (displayName !== encodeURIComponent(displayName)) {
        res.json(403, {
            invalidChars: true
        });
        return;
    }
    userLib.findByDisplayName(displayName, function (err, user) {
        try {
            if (user) {
                res.json(403, {
                    isTaken: true
                });
                return;
            }
            if (err) {
                var responseCode = err.http_code || 500;
                res.json(responseCode, {
                    error: err.message
                });
                return;
            }
        } catch (err) {
            log.error(__filename, ' - ', err);
            res.json(500, {
                error: err.message
            });
            return;
        }
        res.send(200);
    });
};

exports.searchByDisplayName = function (req, res) {
    try {
        var displayName = req.query.displayName;
        if(displayName) {
            userLib.searchByDisplayName(apiUtil.escapeRegExpChars(displayName), function (err, users) {
                if (err || !users || users.length < 1) {
                    res.json(404, {
                        error: 'user not found'
                    });
                    return;
                }

                var userPartials = [];

                users.forEach( function (user) {
                    var userPart = {
                        displayName: user.displayName,
                        photo: user.photo
                    };
                    userPartials.push(userPart);
                });

                res.json(200, userPartials);
            });
        } else {
            res.json(404, {
                error: 'user not found'
            });
        }
    } catch (err) {
        log.error(__filename, ' - ', err);
        res.json(500, {
            error: err.message
        });

    }
};
