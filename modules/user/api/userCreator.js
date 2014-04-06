/*jslint node: true */
'use strict';

var authentication = require( global.config.apps.AUTHENTICATION );
var userLib = require( global.config.apps.USER );
var apiUtil = require(global.config.apps.APIUTIL);
var log = require( global.config.apps.LOGGING ).LOG;


/**
 * Create a new user
 *
 * @param req
 * @param res
 */
exports.create = function ( req, res ) {
    try {
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
        apiUtil.handleError(res, err);
    }
};


