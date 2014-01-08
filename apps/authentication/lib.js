/*jslint node: true*/
"use strict";

var configuration = require( '../../config/config' );
var path = require( 'path' );
var viewDir = path.join( __dirname, 'views' );
var loginPath = path.join( viewDir, 'login' );
var signupPath = path.join( viewDir, 'signup' );
var userApi = path.join( configuration.root, 'apps/user/api' );

exports.userApi = userApi;
exports.loginPath = loginPath;
exports.signupPath = signupPath;

/**
 * Middleware that checks user authentication is ok
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

exports.signup = function signup ( req, res, next ) {
    var body = req.body;
    if ( body.password1 !== body.password2 ) {
        return next( new Error( "Passwords must match" ) );
    }
    pass.createUser(
        body.displayName,
        body.email,
        body.password,
        body.password2,
        false,
        function ( err, user ) {
            if ( err ) {
                return res.render( 'signup', {user: req.user, message: err.code === 11000 ? "User already exists" : err.message} );
            }
            req.login( user, function ( err ) {
                if ( err ) {
                    return next( err );
                }
                // successful login
                res.redirect( '/' );
            } );
        } );

};
