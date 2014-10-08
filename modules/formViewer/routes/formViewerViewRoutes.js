/*jslint node: true */
'use strict';
var path = require('path');
var viewDir = path.resolve(__dirname, '../views');
var express = require('express');
var router = express.Router();


router.get('/partials/formViewer', function (req, res) {
    console.log(path.join(viewDir, 'index'));
    res.render(path.join(viewDir, 'index'));
});


module.exports = router;
