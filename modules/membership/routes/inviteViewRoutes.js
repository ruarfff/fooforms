/*jslint node: true */
'use strict';
var path = require('path');
var viewDir = path.join(__dirname, '../views');
var express = require('express');
var router = express.Router();

router.get('/partials/invite', function (req, res) {
    res.render(path.join(viewDir, 'invite'));
});


module.exports = router;

