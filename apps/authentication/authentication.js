var passport = require('passport')
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
    , TwitterStrategy = require('passport-twitter').Strategy
    , FacebookStrategy = require('passport-facebook').Strategy
    , YahooStrategy = require('passport-yahoo').Strategy
    , LinkedInStrategy = require('passport-linkedin').Strategy
    , configuration = require('../../config/conf');

var User = require('../../models/user').User;

// Passport module serialize and desrialize for users returned from Oauth
passport.serializeUser(function (user, done) {
    done(null, user.uid);
});

passport.deserializeUser(function (uid, done) {
    User.findOne({ uid: uid }, function (err, user) {
        done(err, user);
    });
});

// Passport strategies - Google Facebook and twitter
passport.use(new GoogleStrategy({
        clientID: '150320538991.apps.googleusercontent.com',
        clientSecret: 'yD0Q6YxFTO-MF8LowWyDeWNB',
        callbackURL: "http://" + configuration.serverAddress + "/auth/google/return",
        profileFields: ['id', 'email', 'displayName', 'photos']
    },
    function (accessToken, refreshToken, profile, done) {
        User.findOne({ uid: profile.id }, function (err, user) {
            if (user) {
                done(null, user);
            } else {
                var activeUser = new User();
                activeUser.provider = "google";
                activeUser.uid = profile.id;
                activeUser.displayName = profile.displayName;
                activeUser.photo = profile._json.picture;
                activeUser.save(function (err) {
                    if (err) {
                        throw err;
                    }
                    done(null, user);
                });
            }
        })
    }
));

passport.use(new TwitterStrategy({
        consumerKey: 'nhWoUHO6Qtxp947zr6RSuA',
        consumerSecret: 'upXOlY7vVZsjCwhZKd7xPOVRr4Sd6F0lHxAHSOL7k',
        callbackURL: "http://" + configuration.serverAddress + "/auth/twitter/callback",
        profileFields: ['id', 'email', 'displayName', 'photos']
    },
    function (token, tokenSecret, profile, done) {
        User.findOne({ uid: profile.id }, function (err, user) {
            if (user) {
                done(null, user);
            } else {
                var activeUser = new User();
                activeUser.provider = "twitter";
                activeUser.uid = profile.id;
                activeUser.displayName = profile.displayName;
                activeUser.photo = profile._json.profile_image_url;
                activeUser.save(function (err) {
                    if (err) {
                        throw err;
                    }
                    done(null, user);
                });
            }
        })
    }
));

passport.use(new FacebookStrategy({
        clientID: '549767738378698',
        clientSecret: '3af17cc1e7c7e55df543e39ba3863116',
        callbackURL: "http://" + configuration.serverAddress + "/auth/facebook/callback",
        profileFields: ['id', 'email', 'name', 'picture']
    },
    function (accessToken, refreshToken, profile, done) {

    }
));

passport.use(new YahooStrategy({
        returnURL: "http://" + configuration.serverAddress + "/auth/yahoo/return",
        realm: "http://" + configuration.serverAddress + "/"
    },
    function (identifier, profile, done) {
        User.findOne({ uid: profile.id }, function (err, user) {
            if (user) {
                done(null, user);
            } else {
                profile.identifier = identifier;
                var activeUser = new User();
                console.log("Yahoo Profile", profile)
                activeUser.provider = "yahoo";
                activeUser.uid = profile.identifier;
                activeUser.displayName = profile.name;
                activeUser.save(function (err) {
                    if (err) {
                        throw err;
                    }
                    done(null, activeUser);
                });
            }
        });
    }
));

passport.use(new LinkedInStrategy({
        consumerKey: "u66njfbi0s24",
        consumerSecret: "Xqtv04BVQbuc9nQW",
        callbackURL: "http://" + configuration.serverAddress + "/auth/linkedin/callback"
    },
    function (token, tokenSecret, profile, done) {
        User.findOne({ uid: profile.id }, function (err, user) {
            if (user) {
                done(null, user);
            } else {
                var activeUser = new User();
                console.log("Linkedin Profile", profile)
                activeUser.provider = "linkedin";
                activeUser.uid = profile.id;
                activeUser.displayName = profile.displayName;
                activeUser.photo = profile._json.picture;
                activeUser.save(function (err) {
                    if (err) {
                        throw err;
                    }
                    done(null, user);
                });
            }
        });
    }
));

// checks authentication is ok
function check(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}

function setup(app) {

    app.get('/auth/google',
        passport.authenticate('google', {
            scope: ['https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email']
        }),
        function (req, res) {
            // The request will be redirected to Google for authentication, so this
            // function will not be called.
        });

    app.get('/auth/google/return',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/');
        });


    app.get('/auth/twitter', passport.authenticate('twitter'));

//Twitter will redirect the user to this URL after approval.  Finish the
//authentication process by attempting to obtain an access token.  If
//access was granted, the user will be logged in.  Otherwise,
//authentication has failed.
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/',
            failureRedirect: '/login'
        }));

    app.get('/auth/facebook',
        passport.authenticate('facebook', { scope: ['user_status', 'email'] })
    );

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/login'
        }));

    app.get('/auth/yahoo',
        passport.authenticate('yahoo', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/');
        });

    app.get('/auth/yahoo/return',
        passport.authenticate('yahoo', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/');
        });

    app.get('/auth/linkedin',
        passport.authenticate('linkedin'),
        function (req, res) {
            // The request will be redirected to LinkedIn for authentication, so this
            // function will not be called.
        });

    app.get('/auth/linkedin/callback',
        passport.authenticate('linkedin', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/');
        });
}

exports.passport = passport;
exports.setup = setup;
exports.check = check;