/*jslint node: true */
'use strict';

var path = require('path');
var config = require('../../config/config');

var viewDir = path.join(global.config.apps.APPBUILDER, 'views');
var authentication = require(global.config.apps.AUTHENTICATION);

//var appBuilderApi = require(path.join(global.config.apps.USER, 'api/profile'));

var routes = function (app) {

    app.get('/appbuilder', authentication.ensureAuthenticated, function (req, res) {
        var find = '/';
        var re = new RegExp(find, 'g');

        var cloudName = req.originalUrl.replace(re, '');
        res.render(viewDir + '/index', {
            cloud: cloudName,
            isCloud: 'false',
            user: req.user,
            title: 'appBuilder',
            scripts: [
                '/javascripts/appBuilder/app/appBuilder.js',
                '/javascripts/appBuilder/controllers/controllers.js',
                '/javascripts/appBuilder/directives/directives.js',
                '/javascripts/appBuilder/filters/filters.js',
                '/javascripts/appBuilder/services/services.js'
            ]
        });
    });

};

module.exports = routes;
