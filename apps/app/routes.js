/*jslint node: true */
'use strict';

var path = require('path');
var viewDir = path.join(global.config.apps.APP, 'views');
var authenticator = require(global.config.apps.AUTHENTICATION);
var appApi = require(path.join(global.config.apps.APP, 'api/appApi'));
var postApi = require(path.join(global.config.apps.APP, 'api/postApi'));
var log = require(global.config.apps.LOGGING).LOG;


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
        var scope = req.query.scope;
        var id = req.query.id;
        if (scope === 'post') {
            postApi.getPostById(id, res);
        } else if (scope === 'user') {
            postApi.getUserPosts(req, res);
        } else if (scope === 'app') {
            postApi.getAppPosts(req, res, id);
        } else if (scope === 'cloud') {
            postApi.getCloudPosts(req, res, id);
        }
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
