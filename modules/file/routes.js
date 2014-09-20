/*jslint node: true */
'use strict';

var path = require('path');
var viewDir = path.join(global.config.modules.FILE, 'views');
var fileApi = require(path.join(global.config.modules.FILE, 'api/fileApi'));


var routes = function (app, passport) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/

    app.get('/partials/file', passport.authenticate('basic', { session: false }), function (req, res) {
        var user = req.user;

        res.render(path.join(viewDir, 'index'), {
            user: user
        });
    });
    /*********************************************************************************
     *  API
     *********************************************************************************/

    app.get('/api/file', passport.authenticate('basic', { session: false }), function (req, res) {
        fileApi.getUserFiles(req, res);
    });

    app.get('/api/file/:id', passport.authenticate('basic', { session: false }), function (req, res) {
        fileApi.getFileById(req, res, req.params.id);
    });

    app.post('/api/file/import', passport.authenticate('basic', { session: false }), function (req, res) {
        fileApi.import(req, res);
    });

    app.post('/api/file', passport.authenticate('basic', { session: false }), function (req, res) {
        fileApi.create(req, res);
    });

    app.put('/api/file', passport.authenticate('basic', { session: false }), function (req, res) {
        fileApi.update(req, res);
    });

    app.delete('/api/file', passport.authenticate('basic', { session: false }), function (req, res) {
        fileApi.delete(req, res);
    });

};

module.exports = routes;
