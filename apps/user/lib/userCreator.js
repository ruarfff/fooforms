/*jslint node: true*/
var log = require( global.config.apps.LOGGING ).LOG;
var User = require('../models/user').User;

var createUserCloud = function (user, next) {
    "use strict";
    try {
        var userCloud = {
            name: user.displayName,
            owner: user._id,
            menuLabel: user.displayName,
            isUserCloud: true,
            icon: user.photo
        };
        cloudLib.createCloud(userCloud, next);
    } catch (err) {
        log.error(err);
        next(err);
    }
};

exports.createUserLocalStrategy = function ( userJSON, next ) {
    "use strict";
    try {
        var user = new User( userJSON );
        user.provider = 'local';
        user.save(next);
        /**user.save(function (err, user) {
            if(err) return next(err);
            createUserCloud(user, function (err, cloud) {
                if(err) return next(err);
                user.userCloud = cloud._id;
                user.save(next);
            });
        });*/
    } catch ( err ) {
        log.error(err);
        next(err);
    }
};
