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

    app.get('/api/posts/:post', function (req, res) {
        postApi.getPostById(req.params.post, res);
    });


    app.get('/api/posts', authenticator.ensureAuthenticated, function (req, res) {
        postApi.getUserPosts(req, res);

    });

    app.get('/api/posts/:app', authenticator.ensureAuthenticated, function (req, res) {
        postApi.getAppPosts(req, res, req.params.app);

    });


    app.post('/api/posts', authenticator.ensureAuthenticated, function (req, res) {
        postApi.create(req, res);
    });

    app.put('/api/posts', authenticator.ensureAuthenticated, function (req, res) {
        postApi.update(req, res);
    });

    app.delete('/api/posts', authenticator.ensureAuthenticated, function (req, res) {
        postApi.delete(req, res);
    });

};

module.exports = routes;
