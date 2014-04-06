/*jslint node: true */
'use strict';

var userLib = require( global.config.apps.USER );
var apiUtil = require(global.config.apps.APIUTIL);
var userErrors = require('../lib/userErrors');
var log = require( global.config.apps.LOGGING ).LOG;


/**
 * Send current logged in user
 *
 * @param req
 * @param res
 */
exports.me = function ( req, res ) {
    try {
        res.jsonp( userLib.userToProfile( req.user ) || null );
    } catch ( err ) {
        apiUtil.handleError(res, err);
    }
};

/**
 * Update user profile
 *
 * @param req
 * @param res
 */
exports.updateProfile = function ( req, res ) {
    try {
        var updatedUser = req.body;

        var query = { _id: updatedUser.id };

        userLib.User.findOneAndUpdate( query, updatedUser, {upsert: false, "new": false} ).exec(
            function ( err, user ) {
                if ( !err && !user ) {
                    err = userErrors.userNotFoundError;
                }
                if(err) {
                    apiUtil.handleError(res, err);
                } else {
                    log.debug( "updated " + user.displayName );
                    res.send( user );
                }
            } );
    } catch ( err ) {
        apiUtil.handleError(res, err);
    }
};
