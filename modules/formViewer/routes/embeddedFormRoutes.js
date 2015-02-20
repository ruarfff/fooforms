/*jslint node: true */
'use strict';
var express = require('express');

var embeddedFormController = require('../controllers/embeddedFormController');

var router = express.Router();

router.post('/post', function (req, res, next) {
    embeddedFormController.createPost(req, res, next);
});

router.get('/:form', function (req, res, next) {
    embeddedFormController.renderForm(req, res, next);
});
router.get('/embed/:form', function (req, res, next) {
    embeddedFormController.renderEmbedForm(req, res, next);
});
router.get('/js/:form', function (req, res, next) {
    embeddedFormController.renderJSForm(req, res, next);
});

router.get('/fetch/:form', function (req, res, next) {
    embeddedFormController.getForm(req, res, next);
});

module.exports = router;
