var log = require('fooforms-logging').LOG;
var express = require('express');
var teamController = require('../controllers/teamController');

var router = express.Router();

router.get('/api/folders/:id',
    function (req, res) {
    teamController.getFolderById(req, res, req.params.id);
});

router.get('/api/folders',
    function (req, res) {
    teamController.getUserFolders(req, res);
});

router.get('/api/folders/:name',
    function (req, res) {
    teamController.getFolderByName(req, res, req.params.name);
});

router.get('/api/folders/:id/forms',
    function (req, res) {
    teamController.getFolderForms(req, res, req.params.id);
});

router.post('/api/folders',
    function (req, res) {
    teamController.create(req, res);
});

router.put('/api/folders',
    function (req, res) {
    teamController.update(req, res);
});

router.delete('/api/folders',
    function (req, res) {
    teamController.delete(req, res);
});

router.put('/api/folders/members/add',
    function (req, res) {
    var folderId = req.body.folder._id;
    var userId = req.body.user._id;
    var permissions = req.body.permissions;

    if (permissions && permissions === 'write') {
        teamController.addMemberWithWritePermissions(folderId, userId, req, res);
    } else {
        teamController.addMember(folderId, userId, req, res);
    }
});

router.put('/api/folders/members/remove',
    function (req, res) {
    var folderId = req.body.folder._id;
    var userId = req.body.user._id;
    var permissions = req.body.permissions;

    if (permissions && permissions === 'write') {
        teamController.removeMemberWritePermissions(folderId, userId, req, res);
    } else {
        teamController.removeMember(folderId, userId, req, res);
    }
});

router.put('/api/folders/forms/add',
    function (req, res) {
    var folderId = req.body.folder._id;
    var formId = req.body.user.form._id;
    teamController.addFormToFolder(folderId, formId, req, res);

});

router.put('/api/folders/forms/remove',
    function (req, res) {
    var folderId = req.body.folder._id;
    var formId = req.body.user.form._id;
    teamController.removeFormFromFolder(folderId, formId, req, res);
});


module.exports = router;
