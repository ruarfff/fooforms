/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

var should = require('should');
var assert = require('assert');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId();
// Nasty hack for testing with mocha -w ... see: https://github.com/LearnBoost/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

var mockgoose = require('mockgoose');
mockgoose(mongoose);

var Team = require('../models/team');

describe('Team', function () {
    // Happy path
    describe('initialising a team with default value', function () {
        var team = {};

        var name = 'team';

        before(function (done) {
            mockgoose.reset();
            var testTeam = new Team({name: name});
            testTeam.save(function (err, savedTeam) {
                team = savedTeam;
                done(err);
            });
        });

        after(function () {
            mockgoose.reset();
        });

        it('name is ' + name, function () {
           team.name.should.equal(name);
        });
        it('has no description', function () {
            should.not.exist(team.description);
        });
        it('has no members', function () {
            team.members.length.should.equal(0);
        });
        it('has no forms', function () {
           team.forms.length.should.equal(0);
        });
        it('has default permission level of read', function () {
            team.permissionLevel.should.equal('read');
        });
        it('has a created date', function () {
            team.created.should.be.instanceof(Date);
            should.exist(team.created);
        });
        it('has a last modified date', function () {
            team.lastModified.should.be.instanceof(Date);
            should.exist(team.lastModified);
        });

    });

    describe('initialising a team with some realistic values', function () {
        var team = {};

        var name = 'team';
        var description = 'cool team';
        var members = [ObjectId];
        var forms = [ObjectId];
        var permissionLevel = 'write';

        before(function (done) {
            mockgoose.reset();
            var testTeam = new Team({name: name, description: description,
                members: members, forms: forms, permissionLevel: permissionLevel});
            testTeam.save(function (err, savedTeam) {
                team = savedTeam;
                done(err);
            });
        });

        after(function () {
            mockgoose.reset();
        });

        it('name is ' + name, function () {
            team.name.should.equal(name);
        });
        it('description is' + description, function () {
            team.description.should.equal(description);
        });
        it('has ' + members.length + ' members', function () {
           team.members.length.should.equal(members.length);
        });
        it('has ' + forms.length + ' forms', function () {
           team.forms.length.should.equal(forms.length);
        });
        it('has permission level of ' + permissionLevel, function () {
           team.permissionLevel.should.equal(permissionLevel);
        });
    });

    describe('initializing with no name', function () {
        var team = {};

        before(function () {
            mockgoose.reset();
            team = new Team({});
        });

        after(function () {
            mockgoose.reset();
        });

        it('does not save and gives an error', function (done) {
            team.save(function (err, savedTeam) {
                should.exist(err);
                should.not.exist(savedTeam);
                err.errors.name.path.should.equal('name');
                err.errors.name.type.should.equal('required');
                done();
            });
        });
    });

    describe('initializing with invalid permission level', function () {
        var team = {};

        var name = 'team';
        var permissionLevel = 'bad';

        before(function () {
            mockgoose.reset();
            team = new Team({name: name, permissionLevel: permissionLevel});
        });

        after(function () {
            mockgoose.reset();
        });

        it('does not save and gives an error', function (done) {
            team.save(function (err, savedTeam) {
                should.exist(err);
                should.not.exist(savedTeam);
                err.errors.permissionLevel.message.should.equal(permissionLevel + ' is an invalid permission level');
                done();
            });
        });
    });

});