/*jslint node: true */
'use strict';

var path = require('path');

var viewDir = path.join(global.config.apps.APPVIEWER, 'views');
var authenticator = require(global.config.apps.AUTHENTICATION);
var log = require(global.config.apps.LOGGING).LOG;


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

    app.post('/forms/repo/post', function (req, res) {
        try {
            log.debug('creating post');
            log.debug(JSON.stringify(req.body));
            var body = req.body;
            /**var postDetails = {
                name: body.name,
                description: body.description || '',
                icon: body.icon || '',
                fields: body.fields
            };*/
            require(global.config.apps.APP + '/api/postApi').create(req, res);
        } catch (err) {
            handleError(res, err, 500);
        }
    });

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


    /**
     * A private utility method for handling errors in API calls.
     * TODO: Move this to some kind of reusable utility file.
     * @param res - the response to send he error
     * @param err - The error object. Can be a message.
     * @param responseCode - The desired error response code. Defaults to 500 if empty.
     */
    var handleError = function (res, err, responseCode) {
        try {
            if (!responseCode) {
                responseCode = 500;
            }
            log.error(err);
            res.status(responseCode);
            res.send(err);
        } catch (err) {
            log.error(err);
            res.send(500);
        }
    };
};


module.exports = routes;
