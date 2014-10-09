/*jslint node: true */
"use strict";
var log = require('fooforms-logging').LOG;
var express = require('express');
var router = express.Router();
var formController = require('../controllers/formController');

router.get('', function (req, res, next) {
    formController.listByFolder(req, res, next);
});

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


module.exports = router;
