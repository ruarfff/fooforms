/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId();
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var request = require('supertest');
var express = require('express');
var bodyParser = require('body-parser');
var should = require('should');
var signupRoutes = require('../routes/signupRoutes');
var dashboardRoutes = require('../../dashboard/routes/dashboardApiRoutes');
var rootUrls = require(global.config.root + '/config/rootUrls');
var Membership = require('fooforms-membership');
var db = require('mongoose').connection;
var membership = new Membership(db);

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var engine = require('ejs');
app.engine('.html', engine.__express);
app.set('view engine', 'html');

var rootUrl = '/' + rootUrls.signup;

app.use(rootUrl, signupRoutes);
app.use('/' + rootUrls.dashboard, dashboardRoutes);

describe('Signup Routes', function () {

    var displayName = 'name';
    var email = 'user@test.com';
    var password = 'pass';
    var confirmPass = 'pass';
    var wrongConfirmPass = 'wrong';
    var organisationName = 'fooforms';

    var signUpContent = 'id="signupContent.html"';


    afterEach(function () {
        mockgoose.reset();
    });

    describe('POST ' + rootUrl, function () {
        it('user account is created', function (done) {
            request(app)
                .post(rootUrl)
                .send({ email: email, displayName: displayName,
                    password: password, confirmPass: confirmPass, organisationName: organisationName })
                .set('Accept', 'application/json')
                .expect(200, function (err, data) {
                    membership.findUserByDisplayName(displayName, function (err, result) {
                        should.not.exist(err);
                        result.success.should.equal(true);
                        var signedUpUser = result.data;
                        should.exist(signedUpUser);
                        // Here where checking that all the various bits are set up after signup
                        // The dashboard API populates the user and all the teams, folder etc. so a good test of signup
                        request(app)
                            .get('/' + rootUrls.dashboard + '/user/' + signedUpUser._id)
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(200, function (err, res) {
                                var user = res.body;
                                user._id.should.eql(signedUpUser._id.toString());
                                user.displayName.should.equal(displayName);

                                user.organisations.length.should.equal(1);
                                user.organisations[0].displayName.should.equal(organisationName);

                                user.teams.length.should.equal(2);

                                user.organisations[0].owners.should.eql(user.teams[0]._id);
                                user.organisations[0].members.should.eql(user.teams[1]._id);

                                should.exist(user.defaultFolder);
                                should.exist(user.organisations[0].defaultFolder);
                                should.exist(user.teams[0].defaultFolder);
                                should.exist(user.teams[1].defaultFolder);

                                done(err);
                            });
                    });
                });
        });
        it('responds with error when no email is provided', function (done) {
            request(app)
                .post(rootUrl)
                .send({ email: '', displayName: displayName,
                    password: password, confirmPass: confirmPass, organisationName: organisationName })
                .set('Accept', 'application/json')
                .expect(400, function (err, data) {
                    var result = data.res.body;
                    result.success.should.equal(false);
                    done()
                });
        });
        it('responds with error when no displayName is provided', function (done) {
            request(app)
                .post(rootUrl)
                .send({ email: email, displayName: '',
                    password: password, confirmPass: confirmPass, organisationName: organisationName })
                .set('Accept', 'application/json')
                .expect(400, function (err, data) {
                    var result = data.res.body;
                    result.success.should.equal(false);
                    done()
                });
        });
        it('responds with error when no password is provided', function (done) {
            request(app)
                .post(rootUrl)
                .send({ email: email, displayName: displayName })
                .set('Accept', 'application/json')
                .expect(400, function (err, data) {
                    var result = data.res.body;
                    result.success.should.equal(false);
                    done()
                });
        });
        it('responds with error when passwords do not match', function (done) {
            request(app)
                .post(rootUrl)
                .send({ email: email, displayName: displayName,
                    password: password, confirmPass: wrongConfirmPass, organisationName: organisationName })
                .set('Accept', 'application/json')
                .expect(400, function (err, data) {
                    var result = data.res.body;
                    result.success.should.equal(false);
                    done()
                });
        });
        it('responds with error when no organisation name provided', function (done) {
            request(app)
                .post(rootUrl)
                .send({ email: email, displayName: displayName,
                    password: password, confirmPass: confirmPass })
                .set('Accept', 'application/json')
                .expect(400, function (err, data) {
                    var result = data.res.body;
                    result.success.should.equal(false);
                    done()
                });
        });

        it('checking username returns true', function (done) {
            request(app)
                .post(rootUrl)
                .send({ email: email, displayName: displayName,
                    password: password, confirmPass: confirmPass, organisationName: organisationName })
                .set('Accept', 'application/json')
                .expect(200, function (err, data) {
                  //  (data.text.indexOf(loginTitle) > -1).should.equal(true);
                    request(app)
                        .get(rootUrl + '/check/username/' + displayName)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200).end(function (err, res) {
                            res.body.exists.should.equal(true);
                            done(err);
                        });
                });
        });
        it('checking org name returns true', function (done) {
            request(app)
                .post(rootUrl)
                .send({ email: email, displayName: displayName,
                    password: password, confirmPass: confirmPass, organisationName: organisationName })
                .set('Accept', 'application/json')
                .expect(200, function (err, data) {
                   // (data.text.indexOf(loginTitle) > -1).should.equal(true);
                    request(app)
                        .get(rootUrl + '/check/username/' + organisationName)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200).end(function (err, res) {
                            res.body.exists.should.equal(true);
                            done(err);
                        });
                });
        });
    });

    describe('GET ' + rootUrl, function () {
        it('checking non existent username returns false', function (done) {
            request(app)
                .get(rootUrl + '/check/username/' + 'someName')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200).end(function (err, res) {
                    res.body.exists.should.equal(false);
                    done(err);
                });
        });
        it('checking non existent org name returns false', function (done) {
            request(app)
                .get(rootUrl + '/check/username/' + 'someOrgName')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200).end(function (err, res) {
                    res.body.exists.should.equal(false);
                    done(err);
                });
        });
    });

});

