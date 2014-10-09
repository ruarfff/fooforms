/*jslint node: true */
"use strict";
var log = require('fooforms-logging').LOG;
var express = require('express');
var router = express.Router();
var postController = require('../controllers/postController');

router.get('', function (req, res, next) {
    postController.listByPostStream(req, res, next);
});

router.get('/:post', function (req, res, next) {
    postController.findById(req, res, next);
});

router.get('/:post', function (req, res, next) {
    postController.findById(req, res, next);
});

router.post('', function (req, res, next) {
    postController.create(req, res, next);
});

router.put('', function (req, res, next) {
    postController.update(req, res, next);
});

router.delete('/:post', function (req, res, next) {
    postController.remove(req, res, next);
});

module.exports = router;
