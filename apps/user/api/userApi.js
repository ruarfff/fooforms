/*jslint node: true */
'use strict';
var userLib = require(global.config.apps.USER);

exports.checkUserName = function () {
    userLib.checkDisplayName(display).onResolve(function (err, user) {
        "use strict";
        if (user) {
            res.status(403);
            res.render('signup', {
                error: 'Username is already taken'
            });
            return;
        }
        if (err) {
            res.status(500);
            log.error(err.toString());
            return res.render('signup', { error: err.message });
        }


    });
};
