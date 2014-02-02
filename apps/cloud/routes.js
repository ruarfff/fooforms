/*jslint node: true */
'use strict';

var path = require('path');
var viewDir = path.join(global.config.apps.CLOUD, 'views');
var authenticator = require(global.config.apps.AUTHENTICATION);
var cloudApi = require(path.join(global.config.apps.CLOUD, 'api/cloudApi'));


var routes = function (app) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/

    app.get('/partials/clouds', authenticator.ensureAuthenticated, function (req, res) {
        var user = req.user;

        res.render(path.join(viewDir, 'index'), {
            user: user
        });
    });
    /*********************************************************************************
     *  API
     *********************************************************************************/

    app.get('/api/clouds', authenticator.ensureAuthenticated, function (req, res) {
        cloudApi.getUserClouds(req, res);
    });

    app.get('/api/cloud/:id', authenticator.ensureAuthenticated, function (req, res) {
        cloudApi.getCloudById(req, res, req.params.id);
    });

    app.post('/api/cloud', authenticator.ensureAuthenticated, function (req, res) {
        cloudApi.create(req, res);
    });

    app.put('/api/cloud', authenticator.ensureAuthenticated, function (req, res) {
        cloudApi.update(req, res);
    });

};

module.exports = routes;
