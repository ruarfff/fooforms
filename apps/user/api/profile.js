/*jslint node: true */
'use strict';

var log = require( global.config.apps.LOGGING ).LOG;
var userLib = require( global.config.apps.USER );


/**
 * Send current logged in user
 */
exports.me = function ( req, res ) {
    try {
        res.jsonp( userLib.userToProfile( req.user ) || null );
    } catch ( err ) {
        log.error( err.toString() );
        res.status( 500 );
        res.send( err );
    }

};

/**
 * Update user profile
 */
exports.updateProfile = function ( req, res ) {
    try {
        var updatedUser = req.body;

        var query = { _id: updatedUser.id };

        userLib.User.findOneAndUpdate( query, updatedUser, {upsert: false, "new": false} ).exec(
            function ( err, user ) {
                if ( !err ) {
                    log.debug( "updated " + user.displayName );
                    res.send( user );
                } else {
                    log.error( err.toString() );
                    res.status( 400 );
                    res.send( err );
                }
            } );
    } catch ( err ) {
        log.error( err.toString() );
        res.status( 500 );
        res.send( err );
    }
};
