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
 * Middleware that returns a 401 if user is not logged in
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.ensureLoggedIn = function check ( req, res, next ) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.statusCode = 401;
    var json_resp = {};
    if (req.method === 'GET') {
        json_resp.returnTo = req.originalUrl;
    }
    res.json(json_resp);
};

/**
 * Middleware that checks if the current user is an admin user
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.ensureAdmin = function ensureAdmin ( req, res, next ) {
    if ( req.isAuthenticated() && req.user && req.user.admin === true ) {
        return next();
    }
    res.send( 403 );
};

