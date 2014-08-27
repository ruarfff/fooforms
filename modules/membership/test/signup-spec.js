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

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/signup', signupRoutes);

describe('Signup Routes', function () {

    var displayName = 'name';
    var email = 'user@test.com';
    var password = 'pass';
    var confirmPass = 'pass';
    var wrongConfirmPass = 'wrong';


    beforeEach(function () {
        mongoose.models = {};
        mongoose.modelSchemas = {};
        mockgoose.reset();
    });

    describe('GET /signup', function () {
        it('responds with 200', function (done) {
            request(app)
                .get('/signup')
                .expect(200, done);
        });
    });

    describe('POST /signup', function () {
        it('responds with 200 and json', function (done) {
            request(app)
                .post('/signup')
                .send({ email: email, displayName: displayName,
                    password: password, confirmPass: confirmPass })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
        it('responds with an error when no email is provided', function (done) {
            request(app)
                .post('/signup')
                .send({ email: '', displayName: displayName,
                    password: password, confirmPass: confirmPass })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400, done);
        });
        it('responds with an error when no displayName is provided', function (done) {
            request(app)
                .post('/signup')
                .send({ email: email, displayName: '',
                    password: password, confirmPass: confirmPass })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400, done);
        });
        it('responds with an error when no password is provided', function (done) {
            request(app)
                .post('/signup')
                .send({ email: email, displayName: displayName })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400, done);
        });
        it('responds with an error when passwords do not match', function (done) {
            request(app)
                .post('/signup')
                .send({ email: email, displayName: displayName,
                    password: password, confirmPass: wrongConfirmPass })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400, done);
        });
    });

});

