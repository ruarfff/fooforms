/*jslint node: true */
'use strict';

var path = require('path');
var viewDir = path.join(global.config.apps.APP, 'views');
var authenticator = require(global.config.apps.AUTHENTICATION);
var appApi = require(path.join(global.config.apps.APP, 'api/appApi'));


var routes = function (app) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/
    app.get('/partials/apps', authenticator.ensureAuthenticated, function (req, res) {
        var user = req.user;

        res.render(path.join(viewDir, 'index'), {
            user: user
        });

    });

    /*********************************************************************************
     *  App Retrieval
     *********************************************************************************/

    app.get('/apps/repo/:app', function (req, res) {
        appApi.getAppById(req.params.app, res);
    });

    /*********************************************************************************
     *  API
     *********************************************************************************/

    app.get('/api/apps', authenticator.ensureAuthenticated, function (req, res) {
        appApi.getUserApps(req, res);

    });

    app.post('/api/apps', authenticator.ensureAuthenticated, function (req, res) {
        appApi.create(req, res);
    });

    app.delete('/api/apps', authenticator.ensureAuthenticated, function (req, res) {
        appApi.delete(req, res);
    });


};

module.exports = routes;
