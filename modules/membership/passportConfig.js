/*jslint node: true */
'use strict';

var BasicStrategy = require('passport-http').BasicStrategy;


module.exports = function ( passport, membership ) {

    passport.serializeUser( function ( user, done ) {
        try {
            done( null, user.id );
        } catch (err) {
            done(err);
        }
    } );

    passport.deserializeUser( function ( id, done ) {
        try {
            membership.findUserById(id, done);
        } catch ( err ) {
            done( err );
        }
    } );

    passport.use( new BasicStrategy(
        function(username, password, done) {
            membership.authenticate(username, password, done);
        }
    ));

};
