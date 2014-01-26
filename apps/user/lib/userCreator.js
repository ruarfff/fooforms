/*jslint node: true*/
var User = require( '../models/user' ).User;
var log = require( global.config.apps.LOGGING ).LOG;

exports.createUserLocalStrategy = function ( userJSON, next ) {
    "use strict";
    try {
        var user = new User( userJSON );
        user.provider = 'local';
        user.save( function ( err ) {
            if ( err ) {
                log.error( err.toString() );
            }
            next( err, user );
        } );
    } catch ( err ) {
        log.error( err.toString() );
        next( err, null );
    }

};
