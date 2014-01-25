/*jslint node: true */
'use strict';

var path = require('path');
var viewDir = path.join(global.config.apps.USER, 'views');
var authenticator = require(global.config.apps.AUTHENTICATION);


var userApi = require(path.join(global.config.apps.USER, 'api/profile'));

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
        userApi.me(req, res);
    });

    app.put('/api/user/:id', authenticator.ensureAuthenticated, function (req, res) {
        if (req.user.id === req.params.id) {
            userApi.updateProfile(req, res);
        }
    });

    app.post('/api/user/check/username', authenticator.ensureAuthenticated, function (req, res) {
        userApi.checkUserName(req.body.displayName).onResolve(function (err, user) {
            "use strict";
            if (user) {
                res.status(403);
                res.render('signup', {
                    error: 'Username is already taken'
                });
                return;
            }
            if (err) {
                res.status(500);
                log.error(err.toString());
                return res.render('signup', { error: err.message });
            }

        });
    });


};

module.exports = routes;
