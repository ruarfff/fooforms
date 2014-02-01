/*jslint node: true */
'use strict';

var path = require('path');
var viewDir = path.join(global.config.apps.USER, 'views');
var authenticator = require(global.config.apps.AUTHENTICATION);
var userApi = require(path.join(global.config.apps.USER, 'api/userApi'));

var routes = function (app) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/

    app.get('/partials/profile', authenticator.ensureAuthenticated, function (req, res) {
        var user = req.user;

        res.render(path.join(viewDir, 'profile'), {
            user: user
        });

    });

    app.get('/partials/people', authenticator.ensureAuthenticated, function (req, res) {
        var user = req.user;

        res.render(path.join(viewDir, 'people'), {
            user: user
        });

    });

    /*********************************************************************************
     *  API
     *********************************************************************************/

    app.get('/api/user/me', authenticator.ensureAuthenticated, function (req, res) {
        userApi.me(req, res);
    });

    app.put('/api/user/:id', authenticator.ensureAuthenticated, function (req, res) {
        if (req.user.id === req.params.id) {
            userApi.updateProfile(req, res);
        }
    });

    app.post('/api/user/check/username', function (req, res) {
        userApi.checkUserName(req, res);
    });


};

module.exports = routes;
