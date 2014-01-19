/*jslint node: true */
'use strict';

var path = require('path');
var viewDir = path.join( global.config.apps.USER, 'views' );
var authenticator = require( global.config.apps.AUTHENTICATION );


var profileApi = require('./api/profile');

var routes = function (app) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/

    app.get('/profile', authenticator.ensureAuthenticated, function (req, res) {
        var user = req.user;

        res.render(path.join(viewDir, 'profile'), {
            user: user,
            title: 'Profile',
            scripts: [
                'javascripts/user/controllers/profileController.js',
                'javascripts/user/directives/profileDirective.js',
                'javascripts/user/filters/profileFilter.js',
                'javascripts/user/services/profileService.js'
            ]
        });

    });

    app.get('/people', authenticator.ensureAuthenticated, function (req, res) {
        var user = req.user;

        res.render(path.join(viewDir, 'people'), {
            user: user,
            title: 'People'
        });

    });

    /*********************************************************************************
     *  API
     *********************************************************************************/

    app.get('/api/user/me', authenticator.ensureAuthenticated, function (req, res) {
        profileApi.me(req, res);
    });

    app.put('/api/user/:id', authenticator.ensureAuthenticated, function (req, res) {
        if (req.user.id === req.params.id) {
            profileApi.updateProfile(req, res);
        }
    });

};

module.exports = routes;
