var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId();
var FooForm = require('fooforms-forms');
var Membership = require('fooforms-membership');
var should = require('should');
var assert = require('assert');

exports.generateStore = function (db, next) {
    var fooForm = new FooForm(db);
    var membership = new Membership(db);

    // Used for signup which automatically creates the store org with 2 teams.
    var mockUserDetails = {
        displayName: 'admin',
        email: 'admin@fooforms.com',
        password: 'pass',
        confirmPass: 'pass',
        organisationName: 'formstore'
    };

    var mockForm = {
        displayName: 'form',
        title: 'form title',
        icon: 'www.fooforms.com/icon.png',
        description: 'the form description',
        btnLabel: 'the button label',
        formEvents: [{}],
        settings: {"setting": {}, "something": [], "something-else": "test"},
        fields: [{}, {}, {}]
    };


    membership.register(mockUserDetails, function (err, result) {
        var teamOneName = 'team1';
        var teamTwoName = 'team2';
        var teamThreeName = 'team3';

        var organisation = result.organisation;

        createTeamAndForm({team: teamOneName, org: organisation._id, form: mockForm}, function (err, team) {
            should.not.exist(err);
            organisation.teams.push(team._id);
            createTeamAndForm({team: teamTwoName, org: organisation._id, form: mockForm}, function (err, team) {
                should.not.exist(err);
                organisation.teams.push(team._id);
                createTeamAndForm({team: teamThreeName, org: organisation._id, form: mockForm}, function (err, team) {
                    should.not.exist(err);
                    organisation.teams.push(team._id);
                    organisation.save(function (err) {
                        should.not.exist(err);
                        membership.Organisation.findById(organisation._id).populate('teams').exec(function (err, organisation) {
                            membership.Organisation.populate(organisation, {
                                path: 'teams.folders.forms',
                                model: 'Form'
                            }, function (err, organisation) {
                                return next(err, organisation);
                            });

                        });
                    });
                });
            });
        });

    });

    var createTeamAndForm = function (args, next) {
        var folder = new fooForm.Folder({displayName: 'aFolder'});
        folder.save(function (err, folder) {
            should.not.exist(err);
            membership.createTeam({
                displayName: args.team,
                organisation: args.org,
                folders: [folder._id]
            }, function (err, result) {
                should.not.exist(err);
                var team = result.team;
                args.form.folder = team.folders[0];
                var form = fooForm.Form(args.form);
                form.save(function (err, form) {
                    should.not.exist(err);
                    membership.Team.findById(team._id).populate('folders').exec(function (err, team) {
                        should.not.exist(err);
                        team.folders[0].forms.push(form._id);
                        team.save(function (err, team) {
                            next(err, team);
                        })
                    });
                });
            });
        });
    }


};
