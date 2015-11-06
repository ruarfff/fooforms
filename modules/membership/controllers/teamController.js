var Membership = require('fooforms-membership');
var FooForm = require('fooforms-forms');
var db = require('mongoose').connection;
var log = require('fooforms-logging').LOG;
var statusCodes = require('fooforms-rest').statusCodes;
var slug = require('slug');
var membership = new Membership(db);
var fooForm = new FooForm(db);
var defaultFolders = require('../lib/defaultFolders');
var userProfile = require('../lib/userProfile');
var _ = require('lodash');


var populateForms = function (team, next) {
    membership.Team.populate(team, {path: 'folders', model: 'Folder'}, function (err, team) {
        if (err) return next(err);

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
        if (err) return next(err);

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

exports.searchMembers = function (req, res, next) {
    var searchName = req.params.name;
    membership.Team.findById(req.params.team).populate('members').exec(function (err, team) {
        if (err) return next(err);
        if (!team) {
            res.status(statusCodes.NOT_FOUND).end();
        } else {
            var users = _.filter(team.members, function (user) {
                return user['displayName'].match(new RegExp('^' + searchName, 'i'));
            });

            var userProfiles = [];

            if (users && users.length > 0) {
                users.forEach(function (user) {
                    userProfiles.push(userProfile.userToProfile(user));
                });
            }

            res.status(statusCodes.OK).json(userProfiles);
        }
    });
};

exports.listMembers = function (req, res, next) {
    membership.Team.findById(req.params.team).populate('members').exec(function (err, team) {
        if (err) return next(err);
        if (!team) {
            res.status(statusCodes.NOT_FOUND).end();
        } else {
            var userProfiles = [];

            if (team.members && team.members.length > 0) {
                team.members.forEach(function (user) {
                    userProfiles.push(userProfile.userToProfile(user));
                });
            }

            res.status(statusCodes.OK).json(userProfiles);
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
                        team: team._id || team,
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
        if (err) return next(err);

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
        if (err) return next(err);

        if (result.success) {
            res.status(statusCodes.NO_CONTENT).send();
        } else {
            res.status(statusCodes.BAD_REQUEST).json(result.message);
        }
    });
};

exports.addMember = function (req, res, next) {
    if (req.body.team) {
        membership.Team.findById(req.body.team, function (err, team) {
            if (err) return next(err);
            if (!team) {
                res.status(statusCodes.NOT_FOUND).send();
            } else {
                membership.User.findById(req.body.user, function (err, user) {
                    if (err) return next(err);
                    if (!user) {
                        res.status(statusCodes.NOT_FOUND).send();
                    } else {
                        team.members.push(user._id);
                        user.teams.push(team._id);
                        user.save(function (err) {
                            if (err) return next(err);
                            team.save(function (err, team) {
                                if (err) return next(err);
                                res.status(statusCodes.OK).send(team);
                            });
                        })
                    }
                });
            }
        });
    } else {
        res.status(statusCodes.NOT_FOUND).send();
    }
};

exports.removeMember = function (req, res, next) {
    if (req.body.team) {
        membership.Team.findById(req.body.team, function (err, team) {
            if (err) return next(err);
            if (!team) {
                res.status(statusCodes.NOT_FOUND).send();
            } else {
                membership.User.findById(req.body.user, function (err, user) {
                    if (err) return next(err);
                    if (!user) {
                        res.status(statusCodes.NOT_FOUND).send();
                    } else {
                        var index = team.members.indexOf(user._id);
                        if (index > -1) {
                            team.members.splice(index, 1);
                        }
                        index = user.teams.indexOf(team._id);
                        if (index > -1) {
                            user.teams.splice(index, 1);
                        }

                        user.save(function (err) {
                            if (err) return next(err);
                            team.save(function (err, team) {
                                if (err) return next(err);
                                res.status(statusCodes.OK).send(team);
                            });
                        })
                    }
                });
            }
        });
    } else {
        res.status(statusCodes.NOT_FOUND).send();
    }
};
