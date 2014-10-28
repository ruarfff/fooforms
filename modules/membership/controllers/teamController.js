var Membership = require('fooforms-membership');
var FooForm = require('fooforms-forms');
var db = require('mongoose').connection;
var log = require('fooforms-logging').LOG;
var statusCodes = require('fooforms-rest').statusCodes;
var slug = require('slug');
var membership = new Membership(db);
var fooForm = new FooForm(db);
var defaultFolders = require('../lib/defaultFolders');
var _ = require('underscore');


var populateForms = function (team, next) {
    membership.Team.populate(team, {path: 'folders', model: 'Folder'}, function (err, team) {
        if (err) {
            return next(err);
        }
        membership.Team.populate(team, {path: 'folders.forms', model: 'Form'}, function (err, team) {
            if (typeof team.toObject === 'function') {
                team = team.toObject();
            }
            team.defaultFolder = team.folders[0];
            return next(err, team);
        });
    });
};

exports.findById = function (req, res, next) {
    membership.findTeamById(req.params.team, function (err, result) {
        if (err) {
            next(err);
        }
        if (result.success) {
            var team = result.data;
            populateForms(team, function (err, team) {
                res.send(team);
            });
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
            var team = result.team;

            membership.findOrganisationById(result.team.organisation, function (err, result) {
                if (err || !result || !result.success) {
                    if (result) {
                        err = err || result.err || new Error('Could not add team to organisation');
                    }
                    return next(err);
                }
                result.data.teams.push(team._id);

                membership.updateOrganisation(result.data, function (err) {
                    if (err) return next(err);

                    var args = {
                        teamId: team._id || team,
                        membership: membership,
                        Folder: fooForm.Folder
                    };
                    defaultFolders.createDefaultTeamFolder(args, function (err, result) {
                        var team = result.team;

                        populateForms(team, function (err, team) {
                            if (err) return next(err);

                            res.location('/teams/' + team._id);
                            res.status(statusCodes.CREATED).json(team);
                        });

                    });
                });
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
    if (req.body.folders && req.body.folders[0]._id) {
        req.body.folders = _.pluck(req.body.folders, "_id")
    }
    membership.updateTeam(req.body, function (err, result) {
        if (err) {
            next(err);
        }
        if (result.success) {
            var team = result.team;

            populateForms(team, function (err, team) {
                if (err) return next(err);
                res.send(team);
            });
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
