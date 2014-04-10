/*jslint node: true */
'use strict';

var path = require('path');

var viewDir = path.join(global.config.modules.APPVIEWER, 'views');
var authenticator = require(global.config.modules.AUTHENTICATION);
var apiUtil = require(global.config.modules.APIUTIL);
var log = require(global.config.modules.LOGGING).LOG;


var routes = function (app, passport) {

    /*********************************************************************************
     *  View Handling
     *********************************************************************************/


    app.get('/partials/appViewer', authenticator.ensureLoggedIn, function (req, res) {
        res.render(viewDir + '/index');
    });

    /*********************************************************************************
     *  Embedded App Retrieval
     *********************************************************************************/

    app.post('/forms/repo/post', function (req, res) {
        try {
            require(global.config.apps.APP + '/api/postApi').create(req, res);
        } catch (err) {
            apiUtil.handleError(res, err);
        }
    });

    app.get('/forms/repo/:form', function (req, res) {
        require(global.config.modules.APP).getAppById(req.params.form, function (err, app) {
            if (err) {
                res.send(500);
            }
            if (!app) {
                res.send(404);
            }
            res.render(viewDir + '/embeddedApp', {
                appId: app._id,
                appName: app.name
            });
        });
    });

    app.get('/forms/repo/fetch/:form', function (req, res) {
        require(global.config.modules.APP + '/api/appApi').getAppById(req.params.form, res);
    });

};


module.exports = routes;
