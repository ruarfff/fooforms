/*jslint node: true */
'use strict';

var path = require('path');
var authApi = require(path.join(global.config.modules.AUTHENTICATION, 'api/authenticationApi'));
var authLib = require(global.config.modules.AUTHENTICATION);
var log = require(global.config.modules.LOGGING).LOG;


var routes = function (app, passport) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/

    app.route('/login')
        .get(function (req, res) {
            res.render(authLib.loginPath, {
                title: 'Login',
                message: req.flash('error')
            });
        }).post(passport.authenticate('basic', { session: false }), function (req, res) {
            res.send(200);
        });

    /**
     * Show sign up form
     */
    app.get('/signup', function (req, res) {
        res.render(authLib.signupPath, {
            title: 'Sign up'
        });
    });

    /*********************************************************************************
     *  Local Handlers
     *********************************************************************************/

    app.post('/signup', function (req, res) {
        authApi.signup(req, res);
    });


    /*********************************************************************************
     *  Provider Handlers
     *********************************************************************************/
    var successRedirect = '/dashboard';
    var failureRedirect = '/login';

    app.get('/auth/google',
        passport.authenticate('google', {
            scope: ['https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email']
        }),
        function () {
            // The request will be redirected to Google for authenticator, so this
            // function will not be called.
        });

    app.get('/auth/google/return',
        passport.authenticate('google', { failureRedirect: failureRedirect }),
        function (req, res) {
            res.redirect(successRedirect);
        });


    app.get('/auth/twitter', passport.authenticate('twitter'));

    //Twitter will redirect the user to this URL after approval.  Finish the
    //authenticator process by attempting to obtain an access token.  If
    //access was granted, the user will be logged in.  Otherwise,
    //authenticator has failed.
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: successRedirect,
            failureRedirect: failureRedirect
        }));

    app.get('/auth/facebook',
        passport.authenticate('facebook', { scope: ['user_status', 'email'] })
    );

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: successRedirect,
            failureRedirect: failureRedirect
        }));

    app.get('/auth/yahoo',
        passport.authenticate('yahoo', { failureRedirect: failureRedirect }),
        function (req, res) {
            res.redirect(successRedirect);
        });

    app.get('/auth/yahoo/return',
        passport.authenticate('yahoo', { failureRedirect: failureRedirect }),
        function (req, res) {
            res.redirect(successRedirect);
        });

    app.get('/auth/linkedin',
        passport.authenticate('linkedin'),
        function () {
            // The request will be redirected to LinkedIn for authenticator, so this
            // function will not be called.
        });

    app.get('/auth/linkedin/callback',
        passport.authenticate('linkedin', { failureRedirect: failureRedirect }),
        function (req, res) {
            res.redirect(successRedirect);
        });

};

module.exports = routes;

