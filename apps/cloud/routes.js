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

    app.get('/partials/clouds', authenticator.ensureLoggedIn, function (req, res) {
        var user = req.user;

        res.render(path.join(viewDir, 'index'), {
            user: user
        });
    });
    /*********************************************************************************
     *  API
     *********************************************************************************/

    app.get('/api/clouds', authenticator.ensureLoggedIn, function (req, res) {
        cloudApi.getUserClouds(req, res);
    });

    app.get('/api/clouds/:id', authenticator.ensureLoggedIn, function (req, res) {
        cloudApi.getCloudById(req, res, req.params.id);
    });

    app.post('/api/clouds', authenticator.ensureLoggedIn, function (req, res) {
        cloudApi.create(req, res);
    });

    app.put('/api/clouds', authenticator.ensureLoggedIn, function (req, res) {
        cloudApi.update(req, res);
    });

    app.del('/api/clouds', authenticator.ensureLoggedIn, function (req, res) {
        cloudApi.delete(req, res);
    });

    app.put('/api/clouds/:cloudId/members/add/:userId', authenticator.ensureLoggedIn, function (req, res) {
        var cloudId = req.params.cloudId;
        var userId = req.params.userId;
        var permissions = req.query.permissions;

        if(permissions && permissions === 'write') {
            cloudApi.addMemberWithWritePermissions(cloudId, userId, req, res);
        } else {
            cloudApi.addMember(cloudId, userId, req, res);
        }
    });

    app.put('/api/clouds/:cloudId/members/remove/:userId', authenticator.ensureLoggedIn, function (req, res) {
        var cloudId = req.params.cloudId;
        var userId = req.params.userId;
        var permissions = req.query.permissions;

        if(permissions && permissions === 'write') {
            cloudApi.removeMemberWritePermissions(cloudId, userId, req, res);
        } else {
            cloudApi.removeMember(cloudId, userId, req, res);
        }
    });

};

module.exports = routes;
