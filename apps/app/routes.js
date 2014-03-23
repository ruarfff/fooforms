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
     *  API
     *********************************************************************************/

    app.get('/api/apps', authenticator.ensureLoggedIn, function (req, res) {
        appApi.getUserApps(req, res);
    });

    app.get('/api/posts', authenticator.ensureLoggedIn, function (req, res) {
        if (req.query.postId) {
            postApi.getPostById(req.query.postId, res);
        } else {
            postApi.getUserPosts(req, res);
        }
    });

    app.get('/api/app/posts', authenticator.ensureLoggedIn, function (req, res) {
        postApi.getAppPosts(req, res, req.query.appId);
    });

    app.get('/api/cloud/posts', authenticator.ensureLoggedIn, function (req, res) {
        postApi.getCloudPosts(req, res, req.query.cloudId);
    });

    app.post('/api/apps', authenticator.ensureLoggedIn, function (req, res) {
        appApi.create(req, res);
    });

    app.post('/api/posts', authenticator.ensureLoggedIn, function (req, res) {
        postApi.create(req, res);
    });

    app.put('/api/apps', authenticator.ensureLoggedIn, function (req, res) {
        appApi.update(req, res);
    });

    app.put('/api/posts', authenticator.ensureLoggedIn, function (req, res) {
        postApi.update(req, res);
    });

    app.delete('/api/apps', authenticator.ensureLoggedIn, function (req, res) {
        appApi.delete(req, res);
    });

    app.delete('/api/posts', authenticator.ensureLoggedIn, function (req, res) {
        postApi.delete(req, res);
    });

};

module.exports = routes;
