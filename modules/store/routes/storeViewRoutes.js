/*jslint node: true */
'use strict';
var path = require('path');
var viewDir = path.join(__dirname, '../views');
var express = require('express');
var router = express.Router();

router.get('', function (req, res) {
    res.render(path.join(viewDir, 'index'), {
        dev: (process.env.NODE_ENV === 'development')
    });
});

module.exports = router;
