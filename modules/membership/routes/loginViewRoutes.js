/*jslint node: true */
'use strict';
var path = require('path');
var viewDir = path.join(__dirname, '../views');
var loginPath = path.join(viewDir, 'login');
var express = require('express');
var router = express.Router();

router.get('/partials/login', function (req, res) {
    res.render(loginPath, {
        title: 'Login'
    });
});


module.exports = router;
