/*jslint node: true */
'use strict';

var path = require('path');
var viewDir = path.join(global.config.modules.FORM, 'views');
var authenticator = require(global.config.modules.AUTHENTICATION);
var formApi = require(path.join(global.config.modules.FORM, 'api/formApi'));
var postApi = require(path.join(global.config.modules.FORM, 'api/postApi'));
var log = require(global.config.modules.LOGGING).LOG;


var routes = function (app, passport) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/
    app.get('/partials/forms', authenticator.ensureLoggedIn, function (req, res) {
        var user = req.user;

        res.render(path.join(viewDir, 'index'), {
            user: user
        });

    });

    /*********************************************************************************
     *  API
     *********************************************************************************/

    app.get('/api/forms', authenticator.ensureLoggedIn, function (req, res) {
        formApi.getUserForms(req, res);
    });

    app.get('/api/posts', authenticator.ensureLoggedIn, function (req, res) {
        var scope = req.query.scope;
        var id = req.query.id;
        if (scope === 'post') {
            postApi.getPostById(id, res);
        } else if (scope === 'user') {
            postApi.getUserPosts(req, res);
        } else if (scope === 'form') {
            postApi.getFormPosts(req, res, id);
        } else if (scope === 'folder') {
            postApi.getFolderPosts(req, res, id);
        }
    });

    app.post('/api/forms', authenticator.ensureLoggedIn, function (req, res) {
        formApi.create(req, res);
    });

    app.post('/api/posts', authenticator.ensureLoggedIn, function (req, res) {
        postApi.create(req, res);
    });

    app.put('/api/forms', authenticator.ensureLoggedIn, function (req, res) {
        formApi.update(req, res);
    });

    app.put('/api/posts', authenticator.ensureLoggedIn, function (req, res) {
        postApi.update(req, res);
    });

    app.delete('/api/forms', authenticator.ensureLoggedIn, function (req, res) {
        formApi.delete(req, res);
    });

    app.delete('/api/posts', authenticator.ensureLoggedIn, function (req, res) {
        postApi.delete(req, res);
    });

};

module.exports = routes;
