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
var formRoutes = require('../routes/formRoutes');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/forms', formRoutes);

describe('Form Routes', function () {

    describe('POST /forms', function () {
        afterEach(function () {
            mockgoose.reset();
        });

        it('responds with 200 and json', function (done) {
            request(app)
                .post('/forms')
                .send({ })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('GET /forms', function () {
        var form = {};
        var otherForm = {};

        beforeEach(function (done) {
            request(app)
                .post('/forms')
                .send({ })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    form = res.body.form;
                    request(app)
                        .post('/forms')
                        .send({ })
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end(function (err, res) {
                            otherForm = res.body.form;
                            done(err);
                        });
                });
        });

        afterEach(function () {
            mockgoose.reset();
        });


        it('responds with 200 and json', function (done) {
            request(app)
                .get('/forms/' + form._id)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('PUT /forms', function () {
        var form = {};

        beforeEach(function (done) {
            request(app)
                .post('/forms')
                .send({ })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    form = res.body.form;
                    done(err);
                });
        });

        afterEach(function () {
            mockgoose.reset();
        });
    });

    describe('DELETE /forms', function () {
        var form = {};

        beforeEach(function (done) {
            request(app)
                .post('/forms')
                .send({ })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    form = res.body.form;
                    done(err);
                });
        });

        afterEach(function () {
            mockgoose.reset();
        });
    });
});

