/*jslint node: true */
'use strict';
var path = require('path');
var viewDir = path.join(__dirname, '../views');
var express = require('express');
var router = express.Router();


router.get('/partials/calendar', function (req, res) {
    var user = req.user;

    res.render(path.join(viewDir, 'index'), {
        user: user
    });

});


module.exports = router;
