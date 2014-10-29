"use strict";
var express = require('express');
var router = express.Router();
var log = require('fooforms-logging').LOG;
var inviteController = require('../controllers/inviteController');

router.post('', function (req, res, next) {
    inviteController.create(req, res, next);
});

module.exports = router;
