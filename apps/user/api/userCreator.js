/*jslint node: true */
'use strict';

var authentication = require( global.config.apps.AUTHENTICATION );
var log = require( global.config.apps.LOGGING ).LOG;
var userLib = require( global.config.apps.USER );


/**
 * Create new user
 */
exports.create = function ( req, res ) {
    try {
        var userDetails = {
            displayName: req.displayName,
            name: {
                familyName: req.familyName,
                givenName: req.givenName,
                middleName: req.middleName
            },
            email: req.email,
            password: req.password
        };
        userLib.createUserLocalStrategy( userDetails, function ( err, user ) {
            if ( err ) {
                log.error( err.toString() );
                return res.render( authentication.signupPath, {
                    errors: err.errors,
                    user: user
                } );
            }
        } );
    } catch ( err ) {
        log.error( err.toString() );
        res.status( 500 );
        res.send( err );
    }
};


