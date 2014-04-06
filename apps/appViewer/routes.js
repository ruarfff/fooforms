/*jslint node: true */
'use strict';

var path = require('path');

var viewDir = path.join(global.config.apps.APPVIEWER, 'views');
var authenticator = require(global.config.apps.AUTHENTICATION);
var apiUtil = require(global.config.apps.APIUTIL);
var log = require(global.config.apps.LOGGING).LOG;


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
        require(global.config.apps.APP).getAppById(req.params.form, function (err, app) {
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
        require(global.config.apps.APP + '/api/appApi').getAppById(req.params.form, res);
    });

};


module.exports = routes;
