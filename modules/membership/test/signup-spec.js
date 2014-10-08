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
var signupRoutes = require('../routes/signupRoutes');
var rootUrls = require(global.config.root + '/config/rootUrls');

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

describe('Signup Routes', function () {

    var displayName = 'name';
    var email = 'user@test.com';
    var password = 'pass';
    var confirmPass = 'pass';
    var wrongConfirmPass = 'wrong';
    var organisationName = 'fooforms';

    var loginTitle = '<title>FOOFORMS - Login or Register</title>';
    var signUpTitle = '<title>Sign Up</title>';


    afterEach(function () {
        mockgoose.reset();
    });

    describe('POST ' + rootUrl, function () {
        it('responds with 200 and login page', function (done) {
            request(app)
                .post(rootUrl)
                .send({ email: email, displayName: displayName,
                    password: password, confirmPass: confirmPass, organisationName: organisationName })
                .set('Accept', 'application/json')
                .expect(200, function (err, data) {
                    (data.text.indexOf(loginTitle) > -1).should.equal(true);
                    done()
                });
        });
        it('responds with sign up page when no email is provided', function (done) {
            request(app)
                .post(rootUrl)
                .send({ email: '', displayName: displayName,
                    password: password, confirmPass: confirmPass, organisationName: organisationName })
                .set('Accept', 'application/json')
                .expect(200, function (err, data) {
                    (data.text.indexOf(signUpTitle) > -1).should.equal(true);
                    done()
                });
        });
        it('responds with sign up page when no displayName is provided', function (done) {
            request(app)
                .post(rootUrl)
                .send({ email: email, displayName: '',
                    password: password, confirmPass: confirmPass, organisationName: organisationName })
                .set('Accept', 'application/json')
                .expect(200, function (err, data) {
                    (data.text.indexOf(signUpTitle) > -1).should.equal(true);
                    done()
                });
        });
        it('responds with sign up page when no password is provided', function (done) {
            request(app)
                .post(rootUrl)
                .send({ email: email, displayName: displayName })
                .set('Accept', 'application/json')
                .expect(200, function (err, data) {
                    (data.text.indexOf(signUpTitle) > -1).should.equal(true);
                    done()
                });
        });
        it('responds with sign up page when passwords do not match', function (done) {
            request(app)
                .post(rootUrl)
                .send({ email: email, displayName: displayName,
                    password: password, confirmPass: wrongConfirmPass, organisationName: organisationName })
                .set('Accept', 'application/json')
                .expect(200, function (err, data) {
                    (data.text.indexOf(signUpTitle) > -1).should.equal(true);
                    done()
                });
        });
        it('responds with sign up page when no organisation name provided', function (done) {
            request(app)
                .post(rootUrl)
                .send({ email: email, displayName: displayName,
                    password: password, confirmPass: confirmPass })
                .set('Accept', 'application/json')
                .expect(200, function (err, data) {
                    (data.text.indexOf(signUpTitle) > -1).should.equal(true);
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
                    (data.text.indexOf(loginTitle) > -1).should.equal(true);
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
                    (data.text.indexOf(loginTitle) > -1).should.equal(true);
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

