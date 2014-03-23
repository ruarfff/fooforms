/*jslint node: true */
'use strict';

var path = require('path');
var viewDir = path.join(global.config.apps.APP, 'views');
var authenticator = require(global.config.apps.AUTHENTICATION);
var appApi = require(path.join(global.config.apps.APP, 'api/appApi'));
var postApi = require(path.join(global.config.apps.APP, 'api/postApi'));


var routes = function (app) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/
    app.get('/partials/apps', authenticator.ensureLoggedIn, function (req, res) {
        var user = req.user;

        res.render(path.join(viewDir, 'index'), {
            user: user
        });

    });

    /*********************************************************************************
     *  App Retrieval
     *********************************************************************************/

    app.get('/apps/repo/:app', function (req, res) {
        appApi.getAppById(req.params.app, res);
    });

    /*********************************************************************************
     *  API
     *********************************************************************************/

    app.get('/api/apps', authenticator.ensureLoggedIn, function (req, res) {
        appApi.getUserApps(req, res);
    });

    app.post('/api/apps', authenticator.ensureLoggedIn, function (req, res) {
        appApi.create(req, res);
    });

    app.put('/api/apps', authenticator.ensureLoggedIn, function (req, res) {
        appApi.update(req, res);
    });

    app.delete('/api/apps', authenticator.ensureLoggedIn, function (req, res) {
        appApi.delete(req, res);
    });
    app.get('/api/posts/:post', function (req, res) {
        postApi.getPostById(req.params.post, res);
    });


    app.get('/api/posts', authenticator.ensureLoggedIn, function (req, res) {
        postApi.getUserPosts(req, res);
    });

    app.get('/api/posts/:app', authenticator.ensureLoggedIn, function (req, res) {
        postApi.getAppPosts(req, res, req.params.app);

    });

    app.get('/api/posts/:cloud', authenticator.ensureLoggedIn, function (req, res) {
        postApi.getCloudPosts(req, res, req.params.cloud);

    });

    app.post('/api/posts', authenticator.ensureLoggedIn, function (req, res) {
        postApi.create(req, res);
    });

    app.put('/api/posts', authenticator.ensureLoggedIn, function (req, res) {
        postApi.update(req, res);
    });

    app.delete('/api/posts', authenticator.ensureLoggedIn, function (req, res) {
        postApi.delete(req, res);
    });

};

module.exports = routes;
