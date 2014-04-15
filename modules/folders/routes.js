/*jslint node: true */
'use strict';

var path = require('path');
var viewDir = path.join(global.config.modules.FOLDER, 'views');
var authenticator = require(global.config.modules.AUTHENTICATION);
var folderApi = require(path.join(global.config.modules.FOLDER, 'api/folderApi'));
var log = require(global.config.modules.LOGGING).LOG;

var routes = function (app, passport) {

    /*********************************************************************************
     *  View Handlers
     *********************************************************************************/

    app.get('/partials/folders', authenticator.ensureLoggedIn, function (req, res) {
        var user = req.user;

        res.render(path.join(viewDir, 'index'), {
            user: user
        });
    });
    /*********************************************************************************
     *  API
     *********************************************************************************/

    app.get('/api/folders', authenticator.ensureLoggedIn, function (req, res) {
        folderApi.getUserFolders(req, res);
    });

    app.get('/api/folders/:id', authenticator.ensureLoggedIn, function (req, res) {
        folderApi.getFolderById(req, res, req.params.id);
    });

    app.post('/api/folders', authenticator.ensureLoggedIn, function (req, res) {
        folderApi.create(req, res);
    });

    app.put('/api/folders', authenticator.ensureLoggedIn, function (req, res) {
        folderApi.update(req, res);
    });

    app.delete('/api/folders', authenticator.ensureLoggedIn, function (req, res) {
        folderApi.delete(req, res);
    });

    app.put('/api/folders/members/add', passport.authenticate('basic', { session: false }), function (req, res) {
        var folderId = req.body.folder._id;
        var userId = req.body.user._id;
        var permissions = req.body.permissions;

        if(permissions && permissions === 'write') {
              folderApi.addMemberWithWritePermissions(folderId, userId, req, res);
        } else {
            folderApi.addMember(folderId, userId, req, res);
        }
    });

    app.put('/api/folders/members/remove', passport.authenticate('basic', { session: false }), function (req, res) {
        var folderId = req.body.folder._id;
        var userId = req.body.user._id;
        var permissions = req.body.permissions;

        if(permissions && permissions === 'write') {
            folderApi.removeMemberWritePermissions(folderId, userId, req, res);
        } else {
            folderApi.removeMember(folderId, userId, req, res);
        }
    });

    app.put('/api/folders/forms/add',  passport.authenticate('basic', { session: false }), function (req, res) {
        var folderId = req.body.folder._id;
        var formId = req.body.form._id;
        folderApi.addFormToFolder(folderId, formId, req, res);

    });

    app.put('/api/folders/forms/remove',  passport.authenticate('basic', { session: false }), function (req, res) {
        var folderId = req.body.folder._id;
        var formId = req.body.form._id;
        folderApi.removeFormFromFolder(folderId, formId, req, res);
    });

};

module.exports = routes;
