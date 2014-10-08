/*jslint node: true*/

var log = require('fooforms-logging').LOG;

/**
 * Takes a User Model object and sanitizes it to a profile object which is safe to return to a client.
 *
 * @param user
 * @returns {{id: (_id|*|_id|_id|_id|_id), name: (name|*), displayName: (displayName|*), photo: (*|photo|photo|photo|photo|photo), email: (email|*), admin: (admin|*)}}
 */
exports.userToProfile = function (user) {
    "use strict";
    var profile = {};

    try {
        profile = {
            _id: user._id,
            name: user.name,
            displayName: user.displayName,
            photo: user.photo,
            email: user.email,
            folders: user.folders,
            teams: user.teams,
            organisations: user.organisations
        };
    } catch (err) {
        log.error( __filename, ' - ', err );
    }
    return profile;
};
