/**
 * Created by ruairiobrien on 27/10/2014.
 */
/*jslint node: true */
'use strict';
var path = require('path');
var viewDir = path.join(__dirname, '../views');
var signupPath = path.join(viewDir, 'signup');
var express = require('express');
var router = express.Router();

router.get('/partials/signup', function (req, res) {
    res.render(signupPath);
});


module.exports = router;
