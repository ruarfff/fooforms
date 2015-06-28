var Membership = require('fooforms-membership');
var FooForm = require('fooforms-forms');
var db = require('mongoose').connection;
var log = require('fooforms-logging').LOG;
var stringUtil = require('fooforms-rest').stringUtil;
var statusCodes = require('fooforms-rest').statusCodes;
var slug = require('slug');
var membership = new Membership(db);
var fooForm = new FooForm(db);
var defaultFolders = require('../lib/defaultFolders');
var userProfile = require('../lib/userProfile');
var _ = require('lodash');


exports.findById = function (req, res, next) {
    membership.findOrganisationById(req.params.organisation, function (err, result) {
        if (err) {
            next(err);
        }
        if (result.success) {
            var org = result.data;
            org.defaultFolder = org.folders[0];
            res.send(org);
        } else {
            res.status(statusCodes.NOT_FOUND).json('Organisation not found');
        }
    });
};

exports.searchMembers = function (req, res, next) {
    var searchName = req.params.name;
    membership.Organisation.findById(req.params.organisation).populate('members').exec(function (err, organisation) {
        if (err) next(err);
        if (!organisation) {
            res.status(statusCodes.NOT_FOUND).end();
        } else {
            membership.Organisation.populate(organisation, {
                path: 'members.members',
                model: 'User'
            }, function (err, organisation) {
                var users = _.filter(organisation.members.members, function (user) {
                    return user['displayName'].match(new RegExp('^' + searchName, 'i'));
                });

                var userProfiles = [];

                if (users && users.length > 0) {
                    users.forEach(function (user) {
                        userProfiles.push(userProfile.userToProfile(user));
                    });
                }

                res.status(statusCodes.OK).json(userProfiles);
            });
        }
    });
};

exports.listMembers = function (req, res, next) {
    membership.Organisation.findById(req.params.organisation).populate('members').exec(function (err, organisation) {
        if (err) next(err);
        if (!organisation) {
            res.status(statusCodes.NOT_FOUND).end();
        } else {

            membership.Organisation.populate(organisation, {
                path: 'members.members',
                model: 'User'
            }, function (err, organisation) {
                var userProfiles = [];

                if (organisation.members.members && organisation.members.members.length > 0) {
                    organisation.members.members.forEach(function (user) {
                        userProfiles.push(userProfile.userToProfile(user));
                    });
                }

                res.status(statusCodes.OK).json(userProfiles);
            });
        }
    });
};

exports.listByDisplayName = function (req, res, next) {
    var displayName = req.query.name || '';
    membership.searchOrganisations({displayName: new RegExp('^' + stringUtil.escapeRegExpChars(displayName), 'i')}, function (err, result) {
        if (err) {
            next(err);
        }
        if (result.data && result.data.length > 0) {
            for (var i = 0; i < result.data.length; i++) {
                result.data[i].defaultFolder = result.data[i].folders[0];
            }
        }
        res.status(statusCodes.OK).json(result.data);

    });
};

exports.create = function (req, res, next) {
    if (req.body.displayName) {
        req.body.displayName = slug(req.body.displayName);
    }
    if (req.user && req.user._id) {
        req.body.owner = req.user._id;
    }
    var owner = req.body.owner._id || req.body.owner;
    membership.User.findById(owner, function (err, user) {
        if (err || !user) {
            err = err || new Error('Could not find user');
            next(err);
        } else {
            membership.createOrganisation(req.body, function (err, result) {
                if (err) return next(err, result);

                if (result.success) {
                    var organisation = result.organisation;

                    membership.Organisation.populate(organisation, {
                        path: 'members owners',
                        model: 'Team'
                    }, function (err, organisation) {
                        if (!organisation.members.members) organisation.members.members = [];
                        if (!organisation.owners.members) organisation.owners.members = [];

                        organisation.members.members.push(owner);
                        organisation.owners.members.push(owner);

                        defaultFolders.createDefaultTeamFolder({
                            membership: membership,
                            Folder: fooForm.Folder,
                            team: organisation.members
                        }, function (err, result) {
                            if (err) next(err);

                            var members = result.team;

                            defaultFolders.createDefaultTeamFolder({
                                membership: membership,
                                Folder: fooForm.Folder,
                                team: organisation.owners
                            }, function (err, result) {
                                if (err) next(err);
                                var owners = result.team;

                                user.teams.push(owners._id);
                                user.teams.push(members._id);
                                user.organisations.push(organisation._id);
                                user.save(function (err, user) {
                                    if (err || !user) {
                                        err = err || new Error('Could not save user');
                                        next(err);
                                    } else {
                                        var args = {
                                            organisation: organisation,
                                            membership: membership,
                                            Folder: fooForm.Folder
                                        };
                                        defaultFolders.createDefaultOrganisationFolder(args, function (err, result) {
                                            res.location('/organisations/' + result.organisation._id);
                                            result.organisation.defaultFolder = result.organisation.folders[0];
                                            res.status(statusCodes.CREATED).json(result.organisation);


                                        });
                                    }
                                });

                            })
                        });
                    });
                }

            });
        }

    });
};

exports.update = function (req, res, next) {
    if (req.body.displayName) {
        req.body.displayName = slug(req.body.displayName);
    }
    membership.updateOrganisation(req.body, function (err, result) {
        if (err) {
            next(err);
        }
        if (result.success) {
            result.organisation.defaultFolder = result.organisation.folders[0];
            res.send(result.organisation);
        } else {
            res.status(statusCodes.BAD_REQUEST).json(result.message);
        }
    });
};

exports.remove = function (req, res, next) {
    membership.deleteOrganisation({_id: req.body._id}, function (err, result) {
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


