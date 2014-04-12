/*jslint node: true*/

var log = require( global.config.modules.LOGGING ).LOG;

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
            id: user._id,
            name: user.name,
            displayName: user.displayName,
            photo: user.photo,
            email: user.email
        };
    } catch (err) {
        log.error( __filename, ' - ', err );
    }
    return profile;
};
