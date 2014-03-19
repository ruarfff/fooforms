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
     /**   var userDetails = {
            displayName: req.displayName,
            name: {
                familyName: req.familyName,
                givenName: req.givenName,
                middleName: req.middleName
            },
            email: req.email,
            password: req.password
        };*/
        userLib.createUser( req.body, function ( err, user ) {
            if ( err ) {
                log.error( err );
                return res.render( authentication.signupPath, {
                    errors: err.message,
                    user: user
                } );
            }
        } );
    } catch ( err ) {
        log.error( err );
        res.status( 500 );
        res.send( err );
    }
};


