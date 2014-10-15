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
var organisationApiRoutes = require('../routes/organisationApiRoutes');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var rootUrl = '/' + rootUrls.organisations;
app.use(rootUrl, organisationApiRoutes);

describe('Organisation API', function () {
    // Some test data
    var displayName = 'organisation';
    var owners = ObjectId;
    var billingEmail = 'org@company.com';
    var otherDisplayName = 'otherOrganisation';
    var otherOwners = ObjectId;
    var otherBillingEmail = 'otherorg@company.com';

    var sampleOrg = {
        displayName: displayName, owners: owners, billingEmail: billingEmail
    };
    var otherSampleOrg = {
        displayName: otherDisplayName, owners: otherOwners, billingEmail: otherBillingEmail
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
                .send(sampleOrg)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201, function (err, res) {
                    var organisation = res.body;
                    res.headers.location.should.equal(rootUrl + '/' + organisation._id);
                    organisation.owners.should.equal(organisation.owners.toString());
                    organisation.displayName.should.equal(displayName);
                    organisation.billingEmail.should.equal(billingEmail);
                    organisation.folders.length.should.equal(1);
                    done(err);
                });
        });
    });

    describe('GET ' + rootUrl, function () {
        var organisation = {};
        var otherOrganisation = {};

        beforeEach(function (done) {
            request(app)
                .post(rootUrl)
                .send(sampleOrg)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function (err, res) {
                    organisation = res.body;
                    res.headers.location.should.equal(rootUrl + '/' + organisation._id);
                    request(app)
                        .post(rootUrl)
                        .send(otherSampleOrg)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(201)
                        .end(function (err, res) {
                            otherOrganisation = res.body;
                            res.headers.location.should.equal(rootUrl + '/' + otherOrganisation._id);
                            done(err);
                        });
                });
        });

        afterEach(function () {
            mockgoose.reset();
        });


        it('responds with 200 and json when searching by ID for ' + organisation._id, function (done) {
            request(app)
                .get(rootUrl + '/' + organisation._id)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, function (err, res) {
                    res.body._id.should.equal(organisation._id);
                    done(err);
                });
        });

        it('responds with 200 and json array of length 1 when searching for displayname ' + otherOrganisation.displayName, function (done) {
            request(app)
                .get(rootUrl + '?name=' + otherOrganisation.displayName)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, function (err, res) {
                    res.body.length.should.equal(1);
                    res.body[0]._id.should.equal(otherOrganisation._id);
                    done(err);
                });
        });

        it('responds with 200 and json array of length 2 when searching by displayname ', function (done) {
            request(app)
                .get(rootUrl + '?name=o')// Take care not to change test names or to change this if you do
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, function (err, res) {
                    res.body.length.should.equal(2);
                    done(err);
                });
        });
    });

    describe('PUT ' + rootUrl, function () {
        var organisation = {};
        var resourceUrl;

        beforeEach(function (done) {
            request(app)
                .post(rootUrl)
                .send(sampleOrg)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function (err, res) {
                    organisation = res.body;
                    res.headers.location.should.equal(rootUrl + '/' + organisation._id);
                    resourceUrl = res.headers.location;
                    done(err);
                });
        });

        afterEach(function () {
            mockgoose.reset();
        });

        it('responds with 200 and the updated json', function (done) {
            var billingEmailUpdated = 'new@email.com';
            var orgDomain = 'fooforms.com';
            organisation.billingEmail = billingEmailUpdated;
            organisation.orgDomain = orgDomain;
            request(app)
                .put(resourceUrl)
                .send(organisation)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, function (err, res) {
                    var updatedOrg = res.body;
                    updatedOrg._id.should.equal(organisation._id.toString());
                    updatedOrg.orgDomain.should.equal(orgDomain);
                    updatedOrg.billingEmail.should.equal(billingEmailUpdated);
                    done(err);
                });
        });
    });

    describe('DELETE ' + rootUrl, function () {
        var organisation = {};
        var resourceUrl;

        beforeEach(function (done) {
            request(app)
                .post(rootUrl)
                .send(sampleOrg)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function (err, res) {
                    organisation = res.body;
                    res.headers.location.should.equal(rootUrl + '/' + organisation._id);
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
                .send(organisation)
                .expect(204, done);
        });

    });
});

