/*jslint node: true */
'use strict';

var express = require('express');
var router = express.Router();

var formViewerController = require('../controllers/formViewerController');

router.get('/:form', function (req, res, next) {
    formViewerController.getEmbeddedForm(req, res, next);
});

router.get('/fetch/:form', function (req, res, next) {
    formViewerController.fetchFormJson(req, res, next);
});


module.exports = router;

