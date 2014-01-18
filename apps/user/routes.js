/*jslint node: true */
'use strict';

var config = require( '../../config/config' );
var viewDir = config.root + '/apps/user/views';
var authenticator = require('../authentication/lib/authenticator');
var path = require('path');

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
