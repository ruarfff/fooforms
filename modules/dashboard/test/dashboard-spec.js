/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId();
var mockgoose = require('mockgoose');
var passportStub = require('passport-stub');
mockgoose(mongoose);
var db = mongoose.connection;
// Keep the logger happy TODO: Make this better when I don't have so much stuff to do
global.config = {};
global.config.root = '../../../';

var request = require('supertest');
var express = require('express');
var bodyParser = require('body-parser');
var should = require('should');
var assert = require('assert');
var rootUrls = require(global.config.root + '/config/rootUrls');
var dashboardRoutes = require('../routes/dashboardApiRoutes');
var sampleDashboardCreator = require('./sampleDashboardCreator');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var rootUrl = '/' + rootUrls.dashboard;

app.use(rootUrl, dashboardRoutes);
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
passport.use(new BasicStrategy(
    function (username, password, done) {
        return done();
    }
));

passportStub.install(app);

describe('Dashboard API', function () {

    before(function () {
        mockgoose.reset();
    });

    after(function () {
        mockgoose.reset();
    });

    it('returns a user fully populated with organisation, forms and posts', function (done) {

        sampleDashboardCreator.generateDashboardTestData(db, function (testUser) {
            should.exist(testUser);
            request(app)
                .get(rootUrl + '/user/' + testUser._id)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, function (err, res) {
                    var user = res.body;
                    user._id.should.eql(testUser._id.toString());
                    user.displayName.should.equal(testUser.displayName);
                    user.forms.length.should.equal(testUser.forms.length);
                    user.forms[0]._id.should.equal(testUser.forms[0].toString());
                    user.organisations.length.should.equal(testUser.organisations.length);
                    user.organisations[0]._id.should.equal(testUser.organisations[0]._id.toString());
                    user.organisations[0].forms.length.should.equal(testUser.organisations[0].forms.length);
                    user.organisations[0].forms[0]._id.should.equal(testUser.organisations[0].forms[0].toString());
                    user.teams.length.should.equal(testUser.teams.length);
                    user.teams[0]._id.should.equal(testUser.teams[0].toString());
                    done(err);
                });
        });
    });
});



