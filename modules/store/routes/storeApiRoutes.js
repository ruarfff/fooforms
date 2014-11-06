"use strict";
var express = require('express');
var router = express.Router();
var log = require('fooforms-logging').LOG;
var storeController = require('../controllers/storeController');

router.get('', function (req, res, next) {
    storeController.getStore(req, res, next);
});


module.exports = router;
