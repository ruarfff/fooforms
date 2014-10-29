"use strict";
var express = require('express');
var router = express.Router();
var log = require('fooforms-logging').LOG;
var invitationController = require('../controllers/invitationController');

router.post('', function (req, res, next) {
    invitationController.create(req, res, next);
});

module.exports = router;
