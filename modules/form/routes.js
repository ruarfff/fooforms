/*jslint node: true */
'use strict';

var path = require('path');
var viewDir = path.join(global.config.modules.FORM, 'views');
var authenticator = require(global.config.modules.AUTHENTICATION);
var formApi = require(path.join(global.config.modules.FORM, 'api/formApi'));
var postApi = require(path.join(global.config.modules.FORM, 'api/postApi'));
var commentApi = require(path.join(global.config.modules.FORM, 'api/commentApi'));
var log = require(global.config.modules.LOGGING).LOG;



var express = require('express');
var router = express.Router();


var routes = function (app, passport) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/
    app.get('/partials/forms', passport.authenticate('basic', { session: false }), function (req, res) {
        var user = req.user;

        res.render(path.join(viewDir, 'index'), {
            user: user
        });

    });

    /*********************************************************************************
     *  API
     *********************************************************************************/

    app.get('/api/forms', passport.authenticate('basic', { session: false }), function (req, res) {
        formApi.getUserForms(req, res);
    });

    app.get('/api/posts', passport.authenticate('basic', { session: false }), function (req, res) {
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

    app.post('/api/forms', passport.authenticate('basic', { session: false }), function (req, res) {
        formApi.create(req, res);
    });

    app.post('/api/posts', passport.authenticate('basic', { session: false }), function (req, res) {
        postApi.create(req, res);
    });

    app.put('/api/forms', passport.authenticate('basic', { session: false }), function (req, res) {
        formApi.update(req, res);
    });

    app.put('/api/posts', passport.authenticate('basic', { session: false }), function (req, res) {
        postApi.update(req, res);
    });

    app.delete('/api/forms', passport.authenticate('basic', { session: false }), function (req, res) {
        formApi.delete(req, res);
    });

    app.delete('/api/posts', passport.authenticate('basic', { session: false }), function (req, res) {
        postApi.delete(req, res);
    });

    app.post('/api/comment', passport.authenticate('basic', { session: false }), function (req, res) {
        commentApi.create(req, res);
    });
};

module.exports = routes;
