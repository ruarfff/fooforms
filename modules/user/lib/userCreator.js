/*jslint node: true*/
"use strict";

var log = require( global.config.modules.LOGGING ).LOG;
var User = require('../models/user').User;
var userErrors = require('./userErrors');

// http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

var createUserFolder = function (user, next) {
    try {
        var userFolder = {
            name: user.displayName,
            owner: user._id,
            menuLabel: user.displayName,
            isUserFolder: true,
            icon: user.photo,
            isPrivate: true
        };
        require(global.config.modules.FOLDER).createFolder(userFolder, next);
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

var createUserLocalStrategy = function ( userJSON, next ) {
    try {
        var user = new User( userJSON );
        user.provider = 'local';
        user.save(function (err, user) {
            if(err) {
                return next(err);
            }
            createUserFolder(user, function (err, folder) {
                if(err) {
                    return next(err);
                }
                user.folder = folder._id;
                user.save(next);
            });
        });
    } catch ( err ) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

var createUser = function ( userJSON, next ) {
    try {
        if(userJSON) {
            if ( userJSON.displayName !== encodeURIComponent( userJSON.displayName ) ) {
                return next(userErrors.invalidUserNameError);
            }

            if(!validateEmail(userJSON.email)) {
                return next(userErrors.invalidEmailError);
            }

            // Username should always be lower case
            userJSON.displayName = userJSON.displayName.toLowerCase();
            if(userJSON.provider && userJSON.provider !== 'local') {
                return next(userErrors.notImplementedError);
            } else {
                createUserLocalStrategy(userJSON, function (err, user) {
                    if(err) {
                        return next(err);
                    }
                    if(!user) {
                        return next(userErrors.unknownUserCreationError);
                    }
                    return next(err, user);
                });
            }

        } else {
            return next(userErrors.invalidUserDetailsError);
        }
    } catch ( err ) {
        log.error(__filename, ' - ', err);
        next(err);
    }
};

module.exports = {
    createUser: createUser
};
