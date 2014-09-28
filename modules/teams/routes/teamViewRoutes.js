/*jslint node: true */
'use strict';
var path = require('path');
var viewDir = path.join(path.normalize(__dirname, '../'), 'views');
var express = require('express');
var router = express.Router();

router.get('/partials/team',
    function (req, res) {
        res.render(path.join(viewDir, 'team'));
    });

router.get('/partials/teams',
    function (req, res) {
        res.render(path.join(viewDir, 'index'));
    });


module.exports = router;
