/*jslint node: true */
'use strict';

var authentication = require( global.config.modules.AUTHENTICATION );
var userLib = require( global.config.modules.USER );
var apiUtil = require(global.config.modules.APIUTIL);
var log = require( global.config.modules.LOGGING ).LOG;


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
                log.error( __filename, ' - ', err );
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


