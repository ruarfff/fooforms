"use strict";
var path = require('path');
var viewDir = path.join(__dirname, '../views');
var forgottenPasswordPath = path.join(viewDir, 'forgotten-password');

var express = require('express');
var router = express.Router();

router.get('/partials/forgotten-password', function (req, res) {
    res.render(forgottenPasswordPath);
});

module.exports = router;