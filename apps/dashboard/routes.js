/*jslint node: true */
'use strict';

var config = require('../../config/config');
var viewDir = config.root + '/apps/dashboard/views';
var db = require('../database/lib');
var authentication = require('../authentication/lib');

var routes = function (app) {

app.get('/dashboard',  authentication.ensureAuthenticated, function (req, res) {
    var find = '/';
    var re = new RegExp(find, 'g');

    var cloudName = req.originalUrl.replace(re, '');
    res.render(viewDir +'/index', {
        cloud: cloudName,
        isCloud: 'false',
        user: req.user,
        viewdir: viewDir
    });
});

};

module.exports = routes;
