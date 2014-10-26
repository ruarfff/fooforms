var Membership = require('fooforms-membership');
var FooForm = require('fooforms-forms');
var db = require('mongoose').connection;
var log = require('fooforms-logging').LOG;
var statusCodes = require('fooforms-rest').statusCodes;
var slug = require('slug');
var membership = new Membership(db);
var fooForm = new FooForm(db);
var defaultFolders = require('../lib/defaultFolders');


exports.findById = function (req, res, next) {
    membership.findTeamById(req.params.team, function (err, result) {
        if (err) {
            next(err);
        }
        if (result.success) {
            var team = result.data;
            team.defaultFolder = team.folders[0];
            res.send(team);
        } else {
            res.status(statusCodes.NOT_FOUND).json('Team not found');
        }
    });
};

exports.create = function (req, res, next) {
    if (req.body.displayName) {
        req.body.displayName = slug(req.body.displayName);
    }
    membership.createTeam(req.body, function (err, result) {
        if (err) {
            return next(err);
        }
        if (result.success) {

            var args = {
                teamId: result.team._id || result.team,
                membership: membership,
                Folder: fooForm.Folder
            };
            defaultFolders.createDefaultTeamFolder(args, function (err, result) {
                result.team.defaultFolder = result.team.folders[0];
                res.location('/teams/' + result.team._id);
                res.status(statusCodes.CREATED).json(result.team);
            });

        } else {
            res.status(statusCodes.BAD_REQUEST).json(result);
        }
    });
};

exports.update = function (req, res, next) {
    if (req.body.displayName) {
        req.body.displayName = slug(req.body.displayName);
    }
    membership.updateTeam(req.body, function (err, result) {
        if (err) {
            next(err);
        }
        if (result.success) {
            result.team.defaultFolder = result.team.folders[0];
            res.send(result.team);
        } else {
            res.status(statusCodes.BAD_REQUEST).json(result.message);
        }
    });
};

exports.remove = function (req, res, next) {
    membership.deleteTeam({_id: req.body._id}, function (err, result) {
        if (err) {
            next(err);
        }
        if (result.success) {
            res.status(statusCodes.NO_CONTENT).send();
        } else {
            res.status(statusCodes.BAD_REQUEST).json(result.message);
        }
    });
};
