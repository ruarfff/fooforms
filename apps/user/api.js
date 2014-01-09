/*jslint node: true */
'use strict';

var authentication = require( '../authentication/lib' );
var User = require( './models/user' ).User;

/**
 * Create user
 */
exports.create = function ( req, res, next ) {
    var user = new User( req.body );
    console.log( JSON.stringify( req ) );
    user.provider = 'local';
    user.save( function ( err ) {
        if ( err ) {
            console.log( err.toString() );
            return res.render( authentication.signupPath, {
                errors: err.errors,
                user: user
            } );
        }
        req.logIn( user, function ( loginErr ) {
            if ( loginErr ) {
                return next( loginErr );
            }
            return res.redirect( '/' );
        } );
    } );
};

/**
 * Send User
 */
exports.me = function ( req, res ) {
    res.jsonp( req.user || null );
};

/**
 * Find user by id
 */
exports.user = function ( req, res, next, id ) {
    User
        .findOne( {
            _id: id
        } )
        .exec( function ( err, user ) {
            if ( err ) {
                return next( err );
            }
            if ( !user ) {
                return next( new Error( 'Failed to load User ' + id ) );
            }
            req.profile = user;
            next();
        } );
};
