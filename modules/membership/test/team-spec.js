/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId();
var mockgoose = require('mockgoose');
mockgoose(mongoose);
var Membership = require('fooforms-membership');
var db = require('mongoose').connection;
var membership = new Membership(db);


var request = require('supertest');
var express = require('express');
var bodyParser = require('body-parser');
var should = require('should');
var rootUrls = require('../../../config/rootUrls');
var teamApiRoutes = require('../routes/teamApiRoutes');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var rootUrl = '/' + rootUrls.teams;
app.use(rootUrl, teamApiRoutes);

describe('Team API', function () {
    // Some test data
    var owner = ObjectId;
    var billingEmail = 'org@company.com';
    var name = 'aTeam';
    var organisation;
    var otherName = 'anotherTeam';
    var otherOrganisation;

    var sampleTeam;
    var otherSampleTeam;

    beforeEach(function (done) {
        mockgoose.reset();
        membership.createOrganisation({
            owner: owner,
            billingEmail: billingEmail,
            displayName: 'org'
        }, function (err, result) {
            should.not.exist(err);
            organisation = result.organisation;
            membership.createOrganisation({
                owner: owner,
                billingEmail: billingEmail,
                displayName: 'other-org'
            }, function (err, result) {
                otherOrganisation = result.organisation;

                sampleTeam = {
                    displayName: name, organisation: organisation._id
                };
                otherSampleTeam = {
                    displayName: otherName, organisation: otherOrganisation._id
                };

                done(err);
            });
        })
    });

    describe('POST ' + rootUrl, function () {
        afterEach(function () {
            mockgoose.reset();
        });

        it('responds with 201 and location', function (done) {
            request(app)
                .post(rootUrl)
                .send(sampleTeam)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201, function (err, res) {
                    var team = res.body;
                    res.headers.location.should.equal(rootUrl + '/' + team._id);
                    team.organisation.should.equal(sampleTeam.organisation.toString());
                    team.displayName.should.equal(name);
                    team.folders.length.should.equal(1);
                    team.folders[0].displayName.should.equal('team-folder');
                    should.exist(team.defaultFolder);
                    team.defaultFolder.displayName.should.equal('team-folder');
                    done(err);
                });
        });
    });

    describe('GET ' + rootUrl, function () {
        var team = {};
        var otherTeam = {};

        beforeEach(function (done) {
            request(app)
                .post(rootUrl)
                .send(sampleTeam)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function (err, res) {
                    team = res.body;
                    res.headers.location.should.equal(rootUrl + '/' + team._id);
                    request(app)
                        .post(rootUrl)
                        .send(otherSampleTeam)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(201)
                        .end(function (err, res) {
                            otherTeam = res.body;
                            res.headers.location.should.equal(rootUrl + '/' + otherTeam._id);
                            done(err);
                        });
                });
        });

        afterEach(function () {
            mockgoose.reset();
        });


        it('responds with 200 and json when searching by ID for ' + team._id, function (done) {
            request(app)
                .get(rootUrl + '/' + team._id)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, function (err, res) {
                    res.body._id.should.equal(team._id);
                    res.body.folders.length.should.equal(1);
                    res.body.folders[0].displayName.should.equal('team-folder');
                    should.exist(team.defaultFolder);
                    team.defaultFolder.displayName.should.equal('team-folder');
                    done(err);
                });
        });

    });

    describe('PUT ' + rootUrl, function () {
        var team = {};
        var resourceUrl;

        beforeEach(function (done) {
            request(app)
                .post(rootUrl)
                .send(sampleTeam)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function (err, res) {
                    team = res.body;
                    res.headers.location.should.equal(rootUrl + '/' + team._id);
                    resourceUrl = res.headers.location;
                    done(err);
                });
        });

        afterEach(function () {
            mockgoose.reset();
        });

        it('responds with 200 and the updated json', function (done) {
            var newName = 'newName';
            team.displayName = newName;
            request(app)
                .put(resourceUrl)
                .send(team)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, function (err, res) {
                    var updatedTeam = res.body;
                    updatedTeam._id.should.equal(team._id.toString());
                    updatedTeam.displayName.should.equal(newName);
                    updatedTeam.folders.length.should.equal(1);
                    updatedTeam.folders[0].displayName.should.equal('team-folder');
                    done(err);
                });
        });
    });

    describe('DELETE ' + rootUrl, function () {
        var team = {};
        var resourceUrl;

        beforeEach(function (done) {
            request(app)
                .post(rootUrl)
                .send(sampleTeam)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function (err, res) {
                    team = res.body;
                    res.headers.location.should.equal(rootUrl + '/' + team._id);
                    resourceUrl = res.headers.location;
                    done(err);
                });
        });

        afterEach(function () {
            mockgoose.reset();
        });

        it('successfully deletes', function (done) {
            request(app)
                .delete(rootUrl)
                .send(team)
                .expect(204, done);
        });

    });

    describe('PATCH ' + rootUrl, function () {
        var team = {};
        var resourceUrl;
        var user;

        beforeEach(function (done) {
            var userModel = membership.User({displayName: 'aUser', email: 'user@email.com', password: 'somepass'});
            userModel.save(function (err, savedUser) {
                user = savedUser;
                request(app)
                    .post(rootUrl)
                    .send(sampleTeam)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(201)
                    .end(function (err, res) {
                        team = res.body;
                        res.headers.location.should.equal(rootUrl + '/' + team._id);
                        resourceUrl = res.headers.location;
                        done(err);
                    });
            });
        });

        afterEach(function () {
            mockgoose.reset();
        });

        it('responds with 200 and user is added to team, also team is added to user', function (done) {
            request(app)
                .patch(resourceUrl)
                .send({
                    action: 'addMember',
                    user: user._id
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, function (err, res) {
                    var updatedTeam = res.body;
                    updatedTeam._id.should.equal(team._id.toString());
                    updatedTeam.members.length.should.equal(1);
                    updatedTeam.members[0].should.eql(user._id.toString());
                    membership.User.findById(user._id, function (err, updatedUser) {
                        updatedUser.teams.length.should.equal(1);
                        updatedUser.teams[0].toString().should.eql(updatedTeam._id.toString());
                        done(err);
                    });
                });
        });

        it('responds with 200 and user is removed from team, also team is removed from user', function (done) {
            request(app)
                .patch(resourceUrl)
                .send({
                    action: 'addMember',
                    user: user._id
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, function (err, res) {
                    should.not.exist(err);
                    var updatedTeam = res.body;
                    updatedTeam._id.should.equal(team._id.toString());
                    updatedTeam.members.length.should.equal(1);

                    request(app)
                        .patch(resourceUrl)
                        .send({
                            action: 'removeMember',
                            user: user._id
                        })
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200, function (err, res) {
                            var updatedTeam = res.body;
                            updatedTeam._id.should.equal(team._id.toString());
                            updatedTeam.members.length.should.equal(0);
                            membership.User.findById(user._id, function (err, updatedUser) {
                                updatedUser.teams.length.should.equal(0);
                                done(err);
                            });
                        });
                });
        });
        it('does not add user that does not exist', function (done) {
            request(app)
                .patch(resourceUrl)
                .send({
                    action: 'addMember',
                    user: ObjectId
                })
                .expect(404, function (err, res) {
                    should.not.exist(err);
                    membership.Team.findById(team._id, function (err, team) {
                        should.exist(team);
                        team.members.length.should.equal(0);
                        done(err);
                    });
                });
        });
        it('responds with 400 for a bad request', function (done) {
            request(app)
                .patch(resourceUrl)
                .send({
                    action: 'addMemberXXXX',
                    user: user._id
                })
                .set('Accept', 'application/json')
                .expect(400, done);

        });
    });
});

