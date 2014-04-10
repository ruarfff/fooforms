/*jslint node: true */
'use strict';
var userLib = require( global.config.modules.USER );
var log = require( global.config.modules.LOGGING ).LOG;
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
    // Checking if display name is available. This actually checks for the existence of a cloud
    // with the same name as cloud names match new user names and must be unique.
    userLib.checkDisplayName( displayName, function ( err, cloud ) {
        try {
            if ( cloud ) {
                // Should not be possible to get more than one result but, you know.... just in case
                if ( !_.isArray( cloud ) || cloud.length > 0 ) {
                    res.json( 403, {
                        isTaken: true
                    } );
                    return;
                }
            }
            if ( err ) {
                var responseCode = err.http_code || 500;
                res.json( responseCode, {
                    error: err.message
                } );
                return;
            }
        } catch ( err ) {
            log.error( err );
            res.json( 500, {
                error: err.message
            } );
            return;
        }
        res.send( 200 );
    } );
};
