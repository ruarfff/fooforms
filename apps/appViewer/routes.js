/*jslint node: true */
'use strict';

var path = require('path');

var viewDir = path.join(global.config.apps.APPVIEWER, 'views');
var authenticator = require(global.config.apps.AUTHENTICATION);


var routes = function (app) {

    /*********************************************************************************
     *  View Handling
     *********************************************************************************/


    app.get('/partials/appViewer', authenticator.ensureLoggedIn, function (req, res) {
        res.render(viewDir + '/index');
    });

    /*********************************************************************************
     *  Embedded App Retrieval
     *********************************************************************************/

    app.get('/forms/repo/:form', function (req, res) {
        require(global.config.apps.APP).getAppById(req.params.form, function (err, app) {
            if (err) res.send(500);
            if (!app) res.send(404);

            res.render(viewDir + '/embeddedApp', {
                appId: app._id,
                appName: app.name
            });
        });
    });

    app.get('/forms/repo/fetch/:form', function (req, res) {
        require(global.config.apps.APP + '/api/appApi').getAppById(req.params.form, res);
    });

};

module.exports = routes;
