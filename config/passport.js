/*jslint node: true */
'use strict';

var LocalStrategy = require( 'passport-local' ).Strategy;
var GoogleStrategy = require( 'passport-google-oauth' ).OAuth2Strategy;
var TwitterStrategy = require( 'passport-twitter' ).Strategy;
var FacebookStrategy = require( 'passport-facebook' ).Strategy;
var YahooStrategy = require( 'passport-yahoo' ).Strategy;
var LinkedInStrategy = require( 'passport-linkedin' ).Strategy;

var User = require( global.config.apps.USER ).User;

module.exports = function ( passport ) {

    passport.serializeUser( function ( user, done ) {
        done( null, user.id );
    } );

    passport.deserializeUser( function ( id, done ) {
        User.findOne( {
            _id: id
        }, function ( err, user ) {
            done( err, user );
        } );
    } );


    passport.use( new LocalStrategy(
        function ( email, password, done ) {
            User.findOne( { email: email }, function ( err, user ) {
                if ( err ) {
                    return done( err );
                }
                if ( !user ) {
                    return done( null, false, { message: 'Incorrect login.' } );
                }
                if ( !user.authenticate( password ) ) {
                    return done( null, false, { message: 'Incorrect password.' } );
                }
                return done( null, user );
            } );
        }
    ) );

// Passport strategies - Google Facebook and twitter
    passport.use( new GoogleStrategy( {
            clientID: '150320538991.apps.googleusercontent.com',
            clientSecret: 'yD0Q6YxFTO-MF8LowWyDeWNB',
            callbackURL: "http://" + global.config.serverAddress + "/auth/google/return",
            profileFields: ['id', 'email', 'displayName', 'photos']
        },
        function ( accessToken, refreshToken, profile, done ) {
            User.findOne( { uid: profile.id }, function ( err, user ) {
                if ( user ) {
                    done( null, user );
                } else {
                    var activeUser = new User();
                    activeUser.provider = "google";
                    activeUser.uid = profile.id;
                    activeUser.displayName = profile.displayName;
                    activeUser.photo = profile._json.picture;
                    activeUser.save( function ( err ) {
                        if ( err ) {
                            throw err;
                        }
                        done( null, user );
                    } );
                }
            } );
        }
    ) );

    passport.use( new TwitterStrategy( {
            consumerKey: 'nhWoUHO6Qtxp947zr6RSuA',
            consumerSecret: 'upXOlY7vVZsjCwhZKd7xPOVRr4Sd6F0lHxAHSOL7k',
            callbackURL: "http://" + global.config.serverAddress + "/auth/twitter/callback",
            profileFields: ['id', 'email', 'displayName', 'photos']
        },
        function ( token, tokenSecret, profile, done ) {
            User.findOne( { uid: profile.id }, function ( err, user ) {
                if ( user ) {
                    done( null, user );
                } else {
                    var activeUser = new User();
                    activeUser.provider = "twitter";
                    activeUser.uid = profile.id;
                    activeUser.displayName = profile.displayName;
                    activeUser.photo = profile._json.profile_image_url;
                    activeUser.save( function ( err ) {
                        if ( err ) {
                            throw err;
                        }
                        done( null, user );
                    } );
                }
            } );
        }
    ) );

    passport.use( new FacebookStrategy( {
            clientID: '549767738378698',
            clientSecret: '3af17cc1e7c7e55df543e39ba3863116',
            callbackURL: "http://" + global.config.serverAddress + "/auth/facebook/callback",
            profileFields: ['id', 'email', 'name', 'picture']
        },
        function () {

        }
    ) );

    passport.use( new YahooStrategy( {
            returnURL: "http://" + global.config.serverAddress + "/auth/yahoo/return",
            realm: "http://" + global.config.serverAddress + "/"
        },
        function ( identifier, profile, done ) {
            User.findOne( { uid: profile.id }, function ( err, user ) {
                if ( user ) {
                    done( null, user );
                } else {
                    profile.identifier = identifier;
                    var activeUser = new User();
                    console.log( "Yahoo Profile", profile );
                    activeUser.provider = "yahoo";
                    activeUser.uid = profile.identifier;
                    activeUser.displayName = profile.name;
                    activeUser.save( function ( err ) {
                        if ( err ) {
                            throw err;
                        }
                        done( null, activeUser );
                    } );
                }
            } );
        }
    ) );

    passport.use( new LinkedInStrategy( {
            consumerKey: "u66njfbi0s24",
            consumerSecret: "Xqtv04BVQbuc9nQW",
            callbackURL: "http://" + global.config.serverAddress + "/auth/linkedin/callback"
        },
        function ( token, tokenSecret, profile, done ) {
            User.findOne( { uid: profile.id }, function ( err, user ) {
                if ( user ) {
                    done( null, user );
                } else {
                    var activeUser = new User();
                    console.log( "Linkedin Profile", profile );
                    activeUser.provider = "linkedin";
                    activeUser.uid = profile.id;
                    activeUser.displayName = profile.displayName;
                    activeUser.photo = profile._json.picture;
                    activeUser.save( function ( err ) {
                        if ( err ) {
                            throw err;
                        }
                        done( null, user );
                    } );
                }
            } );
        }
    ) );
};
