/*jslint node: true */
'use strict';
var path = require('path');
var viewDir = path.join(__dirname, '../views');
var indexView = path.join(viewDir, 'index');
var express = require('express');
var assets = require('../../../config/assets');
var router = express.Router();


router.get('/partials/forms', function (req, res) {
    res.render(indexView);

});

module.exports = router;
