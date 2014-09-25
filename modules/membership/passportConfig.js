/*jslint node: true */
'use strict';

var BasicStrategy = require('passport-http').BasicStrategy;
var db = require('mongoose').connection;
var Membership = require('fooforms-membership');


module.exports = function ( passport ) {

    passport.serializeUser( function ( user, done ) {
        try {
            done( null, user.id );
        } catch (err) {
            done(err);
        }
    } );

    passport.deserializeUser( function ( id, done ) {
        try {
            new Membership(db).findUserById(id, function (err, req) {
                if(req.user) {
                    done(err, user);
                } else {
                    done(err, false);
                }
            });
        } catch ( err ) {
            done( err );
        }
    } );

    passport.use( new BasicStrategy(
        function(username, password, done) {
                new Membership(db).authenticate(username, password, function (err, result) {
                    if (err) { return done(err); }
                    if (!result.success || !result.user) { return done(null, false); }
                    return done(null, result.user);
                });
        }
    ));

};
