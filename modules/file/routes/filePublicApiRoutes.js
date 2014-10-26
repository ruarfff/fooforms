/*jslint node: true */
'use strict';

var express = require('express');
var router = express.Router();

var fileController = require('../controllers/fileController');

router.get('/:file', function (req, res) {
    fileController.getFileById(req, res);
});

module.exports = router;
