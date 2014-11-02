/*jslint node: true */
'use strict';
var path = require('path');
var viewDir = path.join(__dirname, '../views');
var express = require('express');
var router = express.Router();
var invitationController = require('../controllers/invitationController');

router.get('/:invite', function (req, res, next) {
    invitationController.findById(req, res, next);
});


module.exports = router;

