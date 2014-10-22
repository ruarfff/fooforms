/*jslint node: true*/

var log = require('fooforms-logging').LOG;


var DEFAULT_USER_FOLDER_NAME = 'my-folder';
var DEFAULT_ORGANISATION_FOLDER_NAME = 'organisation-folder';
var DEFAULT_TEAM_FOLDER_NAME = 'team-folder';

var createDefaultTeamFolder = function (args, next) {
    var teamFolder = new args.Folder({displayName: DEFAULT_TEAM_FOLDER_NAME, owners: [args.team._id]});
    teamFolder.save(function (err, savedTeamFolder) {
        if (err) return next(err);
        args.team.folders = [savedTeamFolder];
        args.membership.updateTeam(args.team, next);
    });
};


exports.createDefaultFolders = function (args, next) {
    var userFolder = new args.Folder({displayName: DEFAULT_USER_FOLDER_NAME, owners: [args.user._id]});
    var organisationFolder = new args.Folder({displayName: DEFAULT_ORGANISATION_FOLDER_NAME, organisation: args.organisation._id});

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
                    args.team = orgUpdateResult.organisation.owners;
                    createDefaultTeamFolder(args, function (err, ownersResult) {
                        args.team = orgUpdateResult.organisation.members;
                        createDefaultTeamFolder(args, function (err, membersResult) {
                            if (userUpdateResult && orgUpdateResult) {
                                result.success = true;
                                result.user = userUpdateResult.user;
                                result.organisation = orgUpdateResult.organisation;
                            }
                        });
                    });

                    return next(err, result);
                });
            });
        });
    });
};

exports.createDefaultUserFolder = function (args, next) {
    var userFolder = new args.Folder({displayName: DEFAULT_USER_FOLDER_NAME, owners: [args.user._id]});
    userFolder.save(function (err, savedUserFolder) {
        if (err) return next(err);
        args.user.folders = [savedUserFolder._id];
        args.membership.updateUser(args.user, next);
    });
};


exports.createDefaultOrganisationFolder = function (args, next) {
    var organisationFolder = new args.Folder({displayName: DEFAULT_ORGANISATION_FOLDER_NAME, organisation: args.organisation._id});
    organisationFolder.save(function (err, savedOrgFolder) {
        if (err) return next(err);
        args.organisation.folders = [savedOrgFolder._id];
        args.membership.updateOrganisation(args.organisation, next);
    });
};

exports.createDefaultTeamFolder = createDefaultTeamFolder;
