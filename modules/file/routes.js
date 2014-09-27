/*jslint node: true */
'use strict';

var path = require('path');
var viewDir = path.join(global.config.modules.FILE, 'views');
var fileApi = require(path.join(global.config.modules.FILE, 'api/fileApi'));


var routes = function (app, passport) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/

    app.get('/partials/file', function (req, res) {
        var user = req.user;

        res.render(path.join(viewDir, 'index'), {
            user: user
        });
    });
    /*********************************************************************************
     *  API
     *********************************************************************************/

    app.get('/api/file', function (req, res) {
        fileApi.getUserFiles(req, res);
    });

    app.get('/api/file/:id', function (req, res) {
        fileApi.getFileById(req, res, req.params.id);
    });

    app.post('/api/file/import', function (req, res) {
        fileApi.import(req, res);
    });

    app.post('/api/file', function (req, res) {
        fileApi.create(req, res);
    });

    app.put('/api/file', function (req, res) {
        fileApi.update(req, res);
    });

    app.delete('/api/file', function (req, res) {
        fileApi.delete(req, res);
    });

};

module.exports = routes;
