/*jslint node: true */
'use strict';

var path = require('path');
var viewDir = path.join(global.config.modules.CLOUD, 'views');
var authenticator = require(global.config.modules.AUTHENTICATION);
var cloudApi = require(path.join(global.config.modules.CLOUD, 'api/cloudApi'));
var log = require(global.config.modules.LOGGING).LOG;

var routes = function (app, passport) {

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

    app.put('/api/clouds/members/add', passport.authenticate('basic', { session: false }), function (req, res) {
        var cloudId = req.body.cloud._id;
        var userId = req.body.user._id;
        var permissions = req.body.permissions;

        if(permissions && permissions === 'write') {
              cloudApi.addMemberWithWritePermissions(cloudId, userId, req, res);
        } else {
            cloudApi.addMember(cloudId, userId, req, res);
        }
    });

    app.put('/api/clouds/members/remove', passport.authenticate('basic', { session: false }), function (req, res) {
        var cloudId = req.body.cloud._id;
        var userId = req.body.user._id;
        var permissions = req.body.permissions;

        if(permissions && permissions === 'write') {
            cloudApi.removeMemberWritePermissions(cloudId, userId, req, res);
        } else {
            cloudApi.removeMember(cloudId, userId, req, res);
        }
    });

    app.put('/api/clouds/forms/add',  passport.authenticate('basic', { session: false }), function (req, res) {
        var cloudId = req.body.cloud._id;
        var formId = req.body.user.form._id;
        cloudApi.addFormToCloud(cloudId, formId, req, res);

    });

    app.put('/api/clouds/forms/remove',  passport.authenticate('basic', { session: false }), function (req, res) {
        var cloudId = req.body.cloud._id;
        var formId = req.body.user.form._id;
        cloudApi.removeFormFromCloud(cloudId, formId, req, res);
    });

};

module.exports = routes;
