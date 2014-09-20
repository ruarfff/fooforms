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
            new Membership(db).findUserById(id, done);
        } catch ( err ) {
            done( err );
        }
    } );

    passport.use( new BasicStrategy(
        function(username, password, done) {
            try {
                new Membership(db).authenticate(username, password, done);
            } catch (err) {
                console.log(err);
            }

        }
    ));

};
