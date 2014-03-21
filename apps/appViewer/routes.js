/*jslint node: true */
'use strict';

var path = require('path');

var viewDir = path.join(global.config.apps.APPVIEWER, 'views');
var authenticator = require(global.config.apps.AUTHENTICATION);

var postApi = require(path.join(global.config.apps.APP, 'api/postApi'));


var routes = function (app) {

    /*********************************************************************************
     *  View Handling
     *********************************************************************************/


    app.get('/partials/appViewer', authenticator.ensureAuthenticated, function (req, res) {
        var find = '/';
        var re = new RegExp(find, 'g');

        var cloudName = req.originalUrl.replace(re, '');
        res.render(viewDir + '/index', {
            cloud: cloudName,
            isCloud: 'false',
            user: req.user
        });
    });

    /*********************************************************************************
     *  API
     *********************************************************************************/


};

module.exports = routes;
