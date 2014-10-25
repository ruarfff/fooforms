/*jslint node: true */
"use strict";
var log = require('fooforms-logging').LOG;
var express = require('express');
var router = express.Router();
var commentController = require('../controllers/commentController');

router.get('', function(req, res, next) {
    commentController.listByStream(req, res, next);
});

router.get('/:comment', function(req, res, next) {
    commentController.findById(req, res, next);
});

router.post('', function (req, res, next) {
    commentController.create(req, res, next);
});

router.put('/:comment', function (req, res, next) {
    commentController.update(req, res, next);
});

router.delete('/:comment', function (req, res, next) {
    commentController.remove(req, res, next);
});

module.exports = router;
