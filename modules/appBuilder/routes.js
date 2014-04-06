/*jslint node: true */
'use strict';

var path = require('path');

var viewDir = path.join(global.config.apps.APPBUILDER, 'views');
var authentication = require(global.config.apps.AUTHENTICATION);

//var appBuilderApi = require(path.join(global.config.apps.USER, 'api/profile'));

var routes = function (app, passport) {

    app.get('/partials/appBuilder', authentication.ensureLoggedIn, function (req, res) {
        var find = '/';
        var re = new RegExp(find, 'g');

        var cloudName = req.originalUrl.replace(re, '');
        res.render(viewDir + '/index', {
            cloud: cloudName,
            isCloud: 'false',
            user: req.user
        });
    });

};

module.exports = routes;
