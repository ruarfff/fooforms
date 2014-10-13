/*jslint node: true */
'use strict';

var express = require('express');
var router = express.Router();

var fileController = require('../controllers/fileController');


router.get('', function (req, res) {
    fileController.getUserFiles(req, res);
    });

router.get('/:file', function (req, res) {
    fileController.getFileById(req, res);
    });

router.post('/import', function (req, res) {
    fileController.import(req, res);
    });

router.post('', function (req, res) {
    fileController.create(req, res);
    });

router.put('', function (req, res) {
    fileController.update(req, res);
    });

router.delete('', function (req, res) {
    fileController.delete(req, res);
    });


module.exports = router;
