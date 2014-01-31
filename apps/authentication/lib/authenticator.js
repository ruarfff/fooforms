/*jslint node: true*/
"use strict";

/**
 * Middleware that checks user is authenticated
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.ensureAuthenticated = function check ( req, res, next ) {
    if ( req.isAuthenticated() ) {
        return next();
    }
    res.redirect( '/login' );
};

/**
 * Middleware that checks if the current user is an admin
 *
 * @param req
 * @param res
 * @param next
 */
exports.ensureAdmin = function ensureAdmin ( req, res, next ) {
    if ( req.user && req.user.admin === true ) {
        next();
    }
    else {
        res.send( 403 );
    }
};


