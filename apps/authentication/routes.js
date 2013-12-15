/*jslint node: true */
'use strict';

var authentication = require('./lib');
var mongoose = require('mongoose');
var User = require('../user/models/user').User;


var routes = function (app, passport) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/

    /**
     * Show login form
     */
    app.get('/login', function (req, res) {
        res.render(authentication.loginPath, {
            title: 'Login',
            message: req.flash('error')
        });
    });

    /**
     * Show sign up form
     */
    app.get('/signup', function (req, res) {
        res.render(authentication.signupPath, {
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
        passport.authenticate('local', { successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true })
    );

    app.post('/signup', function (req, res) {
        var userApi = require(authentication.userApi);
        userApi.create(req, res, function(err){
            console.log(err.toString());
        });
    });

    /*********************************************************************************
     *  Provider Handlers
     *********************************************************************************/


    app.get('/auth/google',
        passport.authenticate('google', {
            scope: ['https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email']
        }),
        function () {
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
        function () {
            // The request will be redirected to LinkedIn for authentication, so this
            // function will not be called.
        });

    app.get('/auth/linkedin/callback',
        passport.authenticate('linkedin', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/');
        });

};

module.exports = routes;

