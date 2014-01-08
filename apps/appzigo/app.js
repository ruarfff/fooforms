// Setup Express
var express = require( 'express' )
    , passport = require( 'passport' )
    , mongoose = require( 'mongoose' )
    , Schema = mongoose.Schema
    , util = require( 'util' )
    , GoogleStrategy = require( 'passport-google-oauth' ).OAuth2Strategy
    , TwitterStrategy = require( 'passport-twitter' ).Strategy
    , FacebookStrategy = require( 'passport-facebook' ).Strategy
    , YahooStrategy = require( 'passport-yahoo' ).Strategy
    , LinkedInStrategy = require( 'passport-linkedin' ).Strategy;
//debugger;
// Define Uaer Schema
var UserSchema = new Schema( {
    provider: String,
    uid: String,
    displayName: String,
    photo: String,
    created: { type: Date, default: Date.now }
} );

// Prepare DB connection info, detect whether server or local by detecting VCAP_SERVICES
if ( process.env.VCAP_SERVICES ) { // Server
    var env = JSON.parse( process.env.VCAP_SERVICES );
    var mongo = env['mongodb-1.8'][0]['credentials'];
    var server = 'appzigo.eu01.aws.af.cm';
} else {// Local
    var server = 'localhost:3000';
    var mongo = {
        "hostname": "localhost",
        "port": 27017,
        "username": "",
        "password": "",
        "name": "",
        "db": "db"
    }
}
;
// Generate the Mongo Db connection URL
var generate_mongo_url = function ( obj ) {
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');
    if ( obj.displayName && obj.password ) {
        return "mongodb://" + obj.displayName + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
    else {
        return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
};
var mongourl = generate_mongo_url( mongo );

// connect Mongoose and apply user model
mongoose.connect( mongourl );
mongoose.model( 'User', UserSchema );
var User = mongoose.model( 'User' );

// Pull in the mongo client and related libs
var MongoClient = require( './../../../../.' ).MongoClient;
var ObjectID = require( './../../../../.' ).ObjectID;
var BSON = require( './../../../../.' ).BSONPure;

// File system
var fs = require( 'fs' );

// Passport module serialize and desrialize for users returned from Oauth
passport.serializeUser( function ( user, done ) {
    done( null, user.uid );
} );

passport.deserializeUser( function ( uid, done ) {
    User.findOne( { uid: uid }, function ( err, user ) {
        done( err, user );
    } );
} );

// Passport strategies - Google Facebook and twitter
passport.use( new GoogleStrategy( {
        clientID: '150320538991.apps.googleusercontent.com',
        clientSecret: 'yD0Q6YxFTO-MF8LowWyDeWNB',
        callbackURL: "http://" + server + "/auth/google/return",
        profileFields: ['id', 'email', 'displayName', 'photos']
    },
    function ( accessToken, refreshToken, profile, done ) {
        User.findOne( { uid: profile.id }, function ( err, user ) {
            if ( user ) {
                done( null, user );
            } else {
                var user = new User();
                user.provider = "google";
                user.uid = profile.id;
                user.displayName = profile.displayName;
                user.photo = profile._json.picture;
                user.save( function ( err ) {
                    if ( err ) {
                        throw err;
                    }
                    done( null, user );
                } );
            }
        } )
    }
) );

passport.use( new TwitterStrategy( {
        consumerKey: 'nhWoUHO6Qtxp947zr6RSuA',
        consumerSecret: 'upXOlY7vVZsjCwhZKd7xPOVRr4Sd6F0lHxAHSOL7k',
        callbackURL: "http://" + server + "/auth/twitter/callback",
        profileFields: ['id', 'email', 'displayName', 'photos']
    },
    function ( token, tokenSecret, profile, done ) {
        User.findOne( { uid: profile.id }, function ( err, user ) {
            if ( user ) {
                done( null, user );
            } else {
                var user = new User();
                user.provider = "twitter";
                user.uid = profile.id;
                user.displayName = profile.displayName;
                user.photo = profile._json.profile_image_url;
                user.save( function ( err ) {
                    if ( err ) {
                        throw err;
                    }
                    done( null, user );
                } );
            }
        } )
    }
) );

passport.use( new FacebookStrategy( {
        clientID: '549767738378698',
        clientSecret: '3af17cc1e7c7e55df543e39ba3863116',
        callbackURL: "http://" + server + "/auth/facebook/callback",
        profileFields: ['id', 'email', 'name', 'picture']
    }

) );

passport.use( new YahooStrategy( {
        returnURL: "http://" + server + "/auth/yahoo/return",
        realm: "http://" + server + "/"
    },
    function ( identifier, profile, done ) {
        process.nextTick( function () {
            if ( user ) {
                done( null, user );
            } else {
                profile.identifier = identifier;
                var user = new User();
                console.log( "Yahoo Profile", profile )
                user.provider = "yahoo";
                user.uid = profile.identifier;
                user.displayName = profile.name;
                user.save( function ( err ) {
                    if ( err ) {
                        throw err;
                    }
                    done( null, user );
                } );
            }
        } );
    }
) );

passport.use( new LinkedInStrategy( {
        consumerKey: "u66njfbi0s24",
        consumerSecret: "Xqtv04BVQbuc9nQW",
        callbackURL: "http://" + server + "/auth/linkedin/callback"
    },
    function ( token, tokenSecret, profile, done ) {
        process.nextTick( function () {
            if ( user ) {
                done( null, user );
            } else {
                var user = new User();
                console.log( "Linkedin Profile", profile )
                user.provider = "linkedin";
                user.uid = profile.id;
                user.displayName = profile.displayName;
                user.photo = profile._json.picture;
                user.save( function ( err ) {
                    if ( err ) {
                        throw err;
                    }
                    done( null, user );
                } );
            }
        } );
    }
) );


// Define our Application
var app = express();
//app Settings
app.set( 'title', 'appzigo' );
app.set( 'views', __dirname + '/views' );
app.set( 'static', __dirname + '/static' );
app.set( 'uploads', __dirname + '/uploads' );
app.engine( 'html', require( 'ejs' ).renderFile );
app.set( 'view engine', 'html' );
app.use( '/static', express.static( 'static' ) );
app.use( express.logger() );
app.use( express.cookieParser( 'appZiG0s3ssi0n' ) );
app.use( express.bodyParser() );
app.use( express.methodOverride() );
app.use( express.session() );
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use( passport.initialize() );
app.use( passport.session() );
app.use( app.router );
app.use( '/api', require( './api/index' ) );


// Main
var userCloud = true;

//
// Routes - One for each page
// res.render calls the EJS templates and passes in parameters
app.get( '/', ensureAuthenticated, function ( req, res ) {

    userCloud = false;

    res.render( 'index', {
        route: 'app',
        cloud: 'Get it done ',
        isCloud: 'false',
        user: req.user
    } );
} );

app.get( '/login', function ( req, res ) {
    res.render( 'login', { user: req.user } );
} );


app.get( '/auth/google',
    passport.authenticate( 'google', {
        scope: ['https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email']
    } ),
    function ( req, res ) {
        // The request will be redirected to Google for authentication, so this
        // function will not be called.
    } );

app.get( '/auth/google/return',
    passport.authenticate( 'google', { failureRedirect: '/login' } ),
    function ( req, res ) {
        res.redirect( '/' );
    } );


app.get( '/auth/twitter', passport.authenticate( 'twitter' ) );

//Twitter will redirect the user to this URL after approval.  Finish the
//authentication process by attempting to obtain an access token.  If
//access was granted, the user will be logged in.  Otherwise,
//authentication has failed.
app.get( '/auth/twitter/callback',
    passport.authenticate( 'twitter', {
        successRedirect: '/',
        failureRedirect: '/login'
    } ) );

app.get( '/auth/facebook',
    passport.authenticate( 'facebook', { scope: ['user_status', 'email'] } )
);

app.get( '/auth/facebook/callback',
    passport.authenticate( 'facebook', {
        successRedirect: '/',
        failureRedirect: '/login'
    } ) );

app.get( '/auth/yahoo',
    passport.authenticate( 'yahoo', { failureRedirect: '/login' } ),
    function ( req, res ) {
        res.redirect( '/' );
    } );

app.get( '/auth/yahoo/return',
    passport.authenticate( 'yahoo', { failureRedirect: '/login' } ),
    function ( req, res ) {
        res.redirect( '/' );
    } );

app.get( '/auth/linkedin',
    passport.authenticate( 'linkedin' ),
    function ( req, res ) {
        // The request will be redirected to LinkedIn for authentication, so this
        // function will not be called.
    } );

app.get( '/auth/linkedin/callback',
    passport.authenticate( 'linkedin', { failureRedirect: '/login' } ),
    function ( req, res ) {
        res.redirect( '/' );
    } );


app.get( '/logout', function ( req, res ) {
    req.logout();
    res.redirect( '/' );
} );


app.get( '/profile', ensureAuthenticated, function ( req, res ) {
    userCloud = false;
    res.render( 'profile', {
        route: 'profile',
        cloud: 'Get it done ',
        isCloud: 'false',
        user: req.user
    } );
} );

app.get( '/clouds', ensureAuthenticated, function ( req, res ) {
    userCloud = false;
    res.render( 'clouds', {
        route: 'clouds',
        cloud: 'Get it done ',
        isCloud: 'false',
        user: req.user
    } );
} );

app.get( '/apps', ensureAuthenticated, function ( req, res ) {
    userCloud = false;
    res.render( 'apps', {
        route: 'apps',
        cloud: 'Get it done ',
        isCloud: 'false',
        user: req.user
    } );
} );

app.get( '/people', ensureAuthenticated, function ( req, res ) {
    userCloud = false;
    res.render( 'people', {
        route: 'people',
        cloud: 'Get it done ',
        isCloud: 'false',
        user: req.user
    } );
} );

app.get( '/help', ensureAuthenticated, function ( req, res ) {
    userCloud = false;
    res.render( 'help', {
        route: 'help',
        cloud: 'Get it done ',
        isCloud: 'false',
        user: req.user
    } );
} );
// user is creating a new app so we need to get a list of available clouds for the user to assign the app to.
// list of available clouds then goes through to EJS template
app.get( '/newapp', ensureAuthenticated, function ( req, res ) {
    userCloud = false;
    MongoClient.connect( mongourl, function ( err, db ) {
        if ( err ) {
            sendResponse( err );

        } else {

            var collection = db.collection( 'cloud' );
            collection.find( { owner: req.user._id } ).toArray( function ( err, clouds ) {
                if ( err ) {
                    sendResponse( err );
                    db.close();
                } else {
                    db.close();
                    res.render( 'newapp', {
                        route: 'newapp',
                        cloud: 'Get it done ',
                        isCloud: 'false',
                        user: req.user,
                        clouds: clouds
                    } );
                }
            } )
        }
    } );

} );

// File Upload
// renames the file and strips its .ext
// returns pointer to db record with details of the file
app.post( '/arrivals', ensureAuthenticated, function ( req, res ) {
    userCloud = false;

    var uloadedFile = req.files.file.path;
    var fileName = req.files.file.filename;
    var mimeType = req.files.file.mime;
    var fileSize = req.files.file.size;
    var fileID = req.param( 'fileID' );

    MongoClient.connect( mongourl, function ( err, db ) {
        if ( err ) {
            sendResponse( err );

        } else {
            var collection = db.collection( 'uploads' );
            var internalName = new ObjectID();
            internalName = internalName.toHexString();
            collection.insert( {
                fileName: fileName,
                internalName: internalName,
                mimeType: mimeType,
                fileSize: fileSize,
                fieldID: fileID,
                owner: req.user.id
            }, function ( err, doc ) {
                if ( err ) {
                    sendResponse( err );
                    db.close();
                } else {

                    db.close();
                    fs.readFile( req.files.file.path, function ( err, data ) {

                        var newPath = __dirname + '/uploads/' + doc[0].internalName;
                        fs.writeFile( newPath, data, function ( err ) {
                            if ( err ) {
                                res.json( err );
                            } else {
                                var response = new Object();
                                response.id = doc[0]._id;
                                response.fieldId = doc[0].fieldID;
                                response.url = '/dispatch/?id=' + doc[0]._id;
                                res.json( response );
                            }
                        } );
                    } );

                }


            } );
        }

    } );


} );


// Get a file
// takes the file id, looks up the file, gets the location and mimeType.
// creates the appropriate html header and sends the raw data
app.get( '/dispatch', function ( req, res ) {
    userCloud = false;
    var img404 = '/static/img/404.jpg';
    MongoClient.connect( mongourl, function ( err, db ) {
        if ( err ) {
            res.send( err );

        } else {
            var collection = db.collection( 'uploads' );
            var externalName = req.param( 'id' );
            try {
                if ( externalName.length == 24 ) {
                    var o_id = new BSON.ObjectID( req.param( 'id' ) );


                    collection.find( { '_id': o_id } ).toArray( function ( err, docs ) {
                        db.close();
                        if ( err || docs.length == 0 ) {
                            res.sendfile( img404 );
                        } else {

                            var file = __dirname + '/uploads/' + docs[0].internalName;
                            response = new Object();
                            response.file = file;
                            response.docs = docs;
                            response.id = req.param( 'id' );

                            fs.readFile( file, function ( err, data ) {
                                if ( err ) {
                                    res.sendfile( img404 );
                                } else {
                                    res.setHeader( "Content-Type", docs[0].mimeType );
                                    res.writeHead( 200 );
                                    res.end( data );
                                }
                            } )

                        }

                        db.close();
                    } );
                } else {
                    res.sendfile( '/static/img/404.jpg', { root: __dirname } )
                }
            } catch ( err ) {
                res.sendfile( img404 );
                db.close();
            }
        }

    } );


} );
// Catch all route for clouds, i.e. appzigo.com/mycloud
// passes the cloudname to the Template engine which creates a JS to load the cloud on document ready.
app.get( '*', ensureAuthenticated, function ( req, res ) {
    var find = '/';
    var re = new RegExp( find, 'g' );

    var cloudName = req.originalUrl.replace( re, '' );
    res.render( 'cloud', {
        route: 'cloud',
        cloud: cloudName,
        isCloud: 'false',
        user: req.user
    } );
} );
// Start our Application listening on Port 3000
app.listen( 3000 );

// checks authentication is ok

function ensureAuthenticated ( req, res, next ) {
    if ( req.isAuthenticated() ) {
        return next();
    }
    res.redirect( '/login' )
}
