/*jslint node: true */
'use strict';

var configuration = require('../../config/config');
var path = require('path');
var viewDir = path.join(__dirname, 'views');
var loginPath = path.join(viewDir, 'login');
var signupPath = path.join(viewDir, 'signup');
var User = require('../user/models/user').User;


var routes = function (app, passport) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/

    /**
     * Show login form
     */
    app.get('/login', function (req, res) {
        res.render(loginPath, {
            title: 'Login',
            message: req.flash('error')
        });
    });

    /**
     * Show sign up form
     */
    app.get('/signup', function (req, res) {
        res.render(signupPath, {
            title: 'Sign up',
            user: new User()
        });
    });

    /*********************************************************************************
     *  Local Handlers
     *********************************************************************************/

    /**
     * Logout
     */
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/login',
        passport.authenticate('local', { successRedirect: '/dashboard',
            failureRedirect: '/login',
            failureFlash: true })
    );


    app.post('/signup', function (req, res) {
        //TODO: Removed previous implementation. Need to come up with secure design for this.
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

