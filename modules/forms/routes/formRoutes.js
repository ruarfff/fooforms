/*jslint node: true */
"use strict";
var log = require('fooforms-logging').LOG;
var express = require('express');
var router = express.Router();
var formController = require('../controllers/formController');

router.get('/:form', function (req, res, next) {
    formController.findById(req, res, next);
});

router.post('', function (req, res, next) {
    formController.create(req, res, next);
});

router.put('/:form', function (req, res, next) {
    formController.update(req, res, next);
});

router.delete('/:form', function (req, res, next) {
    formController.remove(req, res, next);
});

/**
 var routes = function (app, passport) {


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


    app.post('/api/posts', passport.authenticate('basic', { session: false }), function (req, res) {
        postApi.create(req, res);
    });


    app.put('/api/posts', passport.authenticate('basic', { session: false }), function (req, res) {
        postApi.update(req, res);
    });

    app.delete('/api/posts', passport.authenticate('basic', { session: false }), function (req, res) {
        postApi.delete(req, res);
    });

    app.post('/api/comment', passport.authenticate('basic', { session: false }), function (req, res) {
        commentApi.create(req, res);
    });
};*/

module.exports = router;
