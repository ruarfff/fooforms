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
var rootUrls = require('../../../config/rootUrls');
var signupRoutes = require('../routes/signupRoutes');
var userRoutes = require('../routes/userApiRoutes');


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var engine = require('ejs');
app.engine('.html', engine.__express);
app.set('view engine', 'html');

var signupRootUrl = '/' + rootUrls.signup;
var usersRootUrl = '/' + rootUrls.users;

app.use(signupRootUrl, signupRoutes);
app.use(usersRootUrl, userRoutes);

describe('User Routes', function () {

    var displayName = 'name';
    var email = 'user@test.com';
    var otherDisplayName = 'naother';
    var otherEmail = 'otherUser@test.com';
    var password = 'pass';
    var confirmPass = 'pass';
    var organisationName = 'fooforms';
    var otherOrganisationName = 'otherFooforms';

    var user = {};
    var otherUser = {};

    beforeEach(function (done) {
        mockgoose.reset();

        request(app)
            .post(signupRootUrl)
            .send({ email: email, displayName: displayName,
                password: password, confirmPass: confirmPass, organisationName: organisationName })
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, data) {
                should.not.exist(err);
                request(app)
                    .get(usersRootUrl + '?username=' + displayName)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200).end(function (err, res) {
                        user = res.body[0];
                        request(app)
                            .post(signupRootUrl)
                            .send({ email: otherEmail, displayName: otherDisplayName,
                                password: password, confirmPass: confirmPass, organisationName: otherOrganisationName })
                            .set('Accept', 'application/json')
                            .expect(200)
                            .end(function (err, data) {
                                should.not.exist(err);
                                request(app)
                                    .get(usersRootUrl + '?username=' + otherDisplayName)
                                    .set('Accept', 'application/json')
                                    .expect('Content-Type', /json/)
                                    .expect(200).end(function (err, res) {
                                        otherUser = res.body[0];
                                        done(err);
                                    });
                            });
                    });
            });
    });

    describe('GET ' + usersRootUrl, function () {
        it('responds with 200 and json', function (done) {
            request(app)
                .get(usersRootUrl + '/' + user._id)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, function (err, res) {
                    var user = res.body;
                    user._id.should.equal(user._id.toString());
                    user.displayName.should.equal(displayName);
                    user.email.should.equal(email);
                    should.not.exist(user.password);
                    user.folders.length.should.equal(1);
                    done(err);
                });
        });
        it('responds with 404 not found', function (done) {
            request(app)
                .get(usersRootUrl + '/' + ObjectId)
                .expect(404, done);
        });
        it('searching by displayName responds with 200 and a list of one user', function (done) {
            request(app)
                .get(usersRootUrl + '?username=' + user.displayName)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200).end(function (err, res) {
                    res.body.length.should.equal(1);
                    done(err);
                });
        });
        it('searching by displayName responds with 200 and a list of two users', function (done) {
            request(app)
                .get(usersRootUrl + '/?username=' + 'na')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200).end(function (err, res) {
                    res.body.length.should.equal(2);
                    done(err);
                });
        });
        it('searching by displayName responds with 200 and a list of no users', function (done) {
            request(app)
                .get(usersRootUrl + '/?username=' + 'lalalal')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200).end(function (err, res) {
                    res.body.length.should.equal(0);
                    done(err);
                });
        });
    });

    describe('PUT ' + usersRootUrl, function () {

        it('responds with 200 and updated user', function (done) {
            var newEmail = 'shinyNew@email.com';
            user.email = newEmail;
            request(app)
                .put(usersRootUrl + '/' + user._id)
                .send(user)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200).end(function (err, res) {
                    res.body.email.should.equal(newEmail);
                    done(err);
                });
        });
    });

});
