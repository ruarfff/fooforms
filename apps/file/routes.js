/*jslint node: true */
'use strict';

var path = require('path');
var viewDir = path.join(global.config.apps.FILE, 'views');
var authenticator = require(global.config.apps.AUTHENTICATION);
var fileApi = require(path.join(global.config.apps.FILE, 'api/fileApi'));


var routes = function (app) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/

    app.get('/partials/file', authenticator.ensureAuthenticated, function (req, res) {
        var user = req.user;

        res.render(path.join(viewDir, 'index'), {
            user: user
        });
    });
    /*********************************************************************************
     *  API
     *********************************************************************************/

    app.get('/api/file', authenticator.ensureAuthenticated, function (req, res) {
        fileApi.getUserFiles(req, res);
    });

    app.get('/api/file/:id', authenticator.ensureAuthenticated, function (req, res) {
        fileApi.getFileById(req, res, req.params.id);
    });

    app.post('/api/file', authenticator.ensureAuthenticated, function (req, res) {
        fileApi.create(req, res);
    });

    app.put('/api/file', authenticator.ensureAuthenticated, function (req, res) {
        fileApi.update(req, res);
    });

    app.del('/api/file', authenticator.ensureAuthenticated, function (req, res) {
        fileApi.delete(req, res);
    });

};

module.exports = routes;
