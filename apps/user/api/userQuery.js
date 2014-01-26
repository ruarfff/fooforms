/*jslint node: true */
'use strict';
var userLib = require( global.config.apps.USER );
var log = require( global.config.apps.LOGGING ).LOG;
var _ = require( 'underscore' );

exports.checkUserName = function ( req, res ) {
    var displayName = req.body.displayName;
    // check if username contains non-url-safe characters
    if ( displayName !== encodeURIComponent( displayName ) ) {
        res.json( 403, {
            invalidChars: true
        } );
        return;
    }
    userLib.checkDisplayName( displayName, function ( err, user ) {
        try {
            if ( user ) {
                if ( !_.isArray( user ) || user.length > 0 ) {
                    res.json( 403, {
                        isTaken: true
                    } );
                    return;
                }
            }
            if ( err ) {
                log.error( err.toString() );
                res.json( 500, {
                    error: err.message
                } );
                return;
            }
        } catch ( err ) {
            log.error( err.toString() );
            res.json( 500, {
                error: err.message
            } );
        }
        res.send( 200 );
    } );
};
