/*jslint node: true*/

var log = require('fooforms-logging').LOG;


var DEFAULT_USER_FOLDER_NAME = 'my-folder';
var DEFAULT_ORGANISATION_FOLDER_NAME = 'organisation-folder';
var DEFAULT_TEAM_FOLDER_NAME = 'team-folder';

var createDefaultTeamFolder = function (args, next) {
    var teamFolder = new args.Folder({displayName: DEFAULT_TEAM_FOLDER_NAME, team: args.teamId});
    teamFolder.save(function (err, savedTeamFolder) {
        if (err) return next(err);

        args.membership.findTeamById(args.teamId, function (err, result) {
            if (err) return next(err);
            var team = result.data;
            if (team) {
                if (!team.folders) {
                    team.folders = [];
                }
                team.folders.push(savedTeamFolder._id);

                args.membership.updateTeam(team, function (err, result) {
                    if (!err && !result.success) {
                        err = new Error('There was an error trying to create default team folders');
                    }
                    result.team.folders = [savedTeamFolder];
                    next(err, result);
                });
            } else {
                next(new Error('No team found'));
            }
        });
    });
};


exports.createDefaultFolders = function (args, next) {
    var userFolder = new args.Folder({displayName: DEFAULT_USER_FOLDER_NAME, owner: args.user._id});
    var organisationFolder = new args.Folder({
        displayName: DEFAULT_ORGANISATION_FOLDER_NAME,
        organisation: args.organisation._id || args.organisation
    });

    var result = {};

    userFolder.save(function (err, savedUserFolder) {
        if (err) return next(err);
        organisationFolder.save(function (err, savedOrgFolder) {
            if (err) return next(err);
            args.user.folders = [savedUserFolder];
            args.membership.updateUser(args.user, function (err, userUpdateResult) {
                if (err) return next(err);
                args.organisation.folders = [savedOrgFolder];
                args.membership.updateOrganisation(args.organisation, function (err, orgUpdateResult) {
                    var ownersFolderArgs = {
                        teamId: orgUpdateResult.organisation.owners._id || orgUpdateResult.organisation.owners,
                        membership: args.membership,
                        Folder: args.Folder
                    };
                    createDefaultTeamFolder(ownersFolderArgs, function (err, ownersFolderResult) {
                        if (err) return next(err);
                        var membersFolderArgs = {
                            teamId: orgUpdateResult.organisation.members._id || orgUpdateResult.organisation.members,
                            membership: args.membership,
                            Folder: args.Folder
                        };
                        createDefaultTeamFolder(membersFolderArgs, function (err) {
                            if (err) return next(err);
                            if (userUpdateResult.success && orgUpdateResult.success) {
                                result.success = true;
                                result.user = userUpdateResult.user;
                                result.organisation = orgUpdateResult.organisation;
                            }
                            return next(err, result);
                        });
                    });

                });
            });
        });
    });
};

exports.createDefaultUserFolder = function (args, next) {
    var userFolder = new args.Folder({displayName: DEFAULT_USER_FOLDER_NAME, owner: args.user._id});
    userFolder.save(function (err, savedUserFolder) {
        if (err) return next(err);
        args.user.folders = [savedUserFolder._id];
        args.membership.updateUser(args.user, next);
    });
};


exports.createDefaultOrganisationFolder = function (args, next) {
    var organisationFolder = new args.Folder({
        displayName: DEFAULT_ORGANISATION_FOLDER_NAME,
        organisation: args.organisation._id
    });
    organisationFolder.save(function (err, savedOrgFolder) {
        if (err) return next(err);
        args.organisation.folders = [savedOrgFolder._id];
        args.membership.updateOrganisation(args.organisation, next);
    });
};

exports.createDefaultTeamFolder = createDefaultTeamFolder;
