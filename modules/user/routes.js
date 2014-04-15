/*jslint node: true */
'use strict';

var path = require('path');
var viewDir = path.join(global.config.modules.USER, 'views');
var authenticator = require(global.config.modules.AUTHENTICATION);
var userApi = require(path.join(global.config.modules.USER, 'api/userApi'));
var userLib = require(global.config.modules.USER);

var routes = function (app, passport) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/

    app.get('/partials/profile', passport.authenticate('basic', { session: false }), function (req, res) {
        var user = req.user;

        res.render(path.join(viewDir, 'profile'), {
            user: user
        });

    });

    app.get('/partials/people', passport.authenticate('basic', { session: false }), function (req, res) {
        var user = req.user;

        res.render(path.join(viewDir, 'people'), {
            user: user
        });

    });

    /*********************************************************************************
     *  API
     *********************************************************************************/

    app.get('/api/user/me', passport.authenticate('basic', { session: false }), function (req, res) {
        userApi.me(req, res);
    });

    app.get('/api/users', passport.authenticate('basic', { session: false }), function(req, res) {
        userApi.searchByUsername(req, res);
    });

    app.put('/api/user/:id', passport.authenticate('basic', { session: false }), function (req, res) {
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
