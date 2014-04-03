/*jslint node: true */
'use strict';

var path = require('path');
var viewDir = path.join(global.config.apps.USER, 'views');
var authenticator = require(global.config.apps.AUTHENTICATION);
var userApi = require(path.join(global.config.apps.USER, 'api/userApi'));
var userLib = require(global.config.apps.USER);

var routes = function (app, passport) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/

    app.get('/partials/profile', authenticator.ensureLoggedIn, function (req, res) {
        var user = req.user;

        res.render(path.join(viewDir, 'profile'), {
            user: user
        });

    });

    app.get('/partials/people', authenticator.ensureLoggedIn, function (req, res) {
        var user = req.user;

        res.render(path.join(viewDir, 'people'), {
            user: user
        });

    });

    /*********************************************************************************
     *  API
     *********************************************************************************/

    app.get('/api/user/me', authenticator.ensureLoggedIn, function (req, res) {
        userApi.me(req, res);
    });

    // route to test if the user is logged in or not
    app.get('/api/user/loggedin', function(req, res) {
        if(req.isAuthenticated()) {
            return userApi.me(req, res);
        }
        res.send(401);
    });

    app.put('/api/user/:id', authenticator.ensureLoggedIn, function (req, res) {
        if (req.user.id === req.params.id) {
            return userApi.updateProfile(req, res);
        }
        res.send(403);
    });

    app.post('/api/user/check/username', function (req, res) {
        userApi.checkUserName(req, res);
    });

};

module.exports = routes;
