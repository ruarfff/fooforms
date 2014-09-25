/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId();
var mockgoose = require('mockgoose');
mockgoose(mongoose);

global.config = {};
global.config.root = '../../../';

var request = require('supertest');
var express = require('express');
var bodyParser = require('body-parser');
var should = require('should');
var rootUrls = require(global.config.root + '/config/rootUrls');
var teamRoutes = require('../routes/teamRoutes');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var rootUrl = '/' + rootUrls.teams;
app.use(rootUrl, teamRoutes);

describe('Team API', function () {
    // Some test data
    var name = 'aTeam';
    var organisation = ObjectId;
    var otherName = 'anotherTeam';
    var otherOrganisation = ObjectId.defineProperty;

    var sampleTeam = {
        name: name, organisation: organisation
    };
    var otherSampleTeam = {
        name: otherName, organisation: otherOrganisation
    };

    before(function () {
        mockgoose.reset();
    });

    describe('POST ' + rootUrl, function () {
        afterEach(function () {
            mockgoose.reset();
        });

        it('responds with 200 and json', function (done) {
            request(app)
                .post(rootUrl)
                .send(sampleTeam)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201, function (err, res) {
                    var team = res.body.team;
                    res.headers.location.should.equal(rootUrl + '/' + team._id);
                    team.organisation.should.equal(sampleTeam.organisation.toString());
                    team.name.should.equal(name);
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
                    team = res.body.team;
                    res.headers.location.should.equal(rootUrl + '/' + team._id);
                    request(app)
                        .post(rootUrl)
                        .send(otherSampleTeam)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(201)
                        .end(function (err, res) {
                            otherTeam = res.body.team;
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
                    team = res.body.team;
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
            team.name = newName;
            request(app)
                .put(resourceUrl)
                .send(team)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, function (err, res) {
                    var updatedTeam = res.body.team;
                    updatedTeam._id.should.equal(team._id.toString());
                    updatedTeam.name.should.equal(newName);
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
                    team = res.body.team;
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
                .delete(resourceUrl)
                .expect(204, done);
        });

    });
});

