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
var postRoutes = require('../routes/postRoutes');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var rootUrl = '/posts';
app.use(rootUrl, postRoutes);

describe('Post API', function () {
    // Some test data
    var postStream = ObjectId;
    var name = 'post';
    var icon = 'www.fooforms.com/icon.png';
    var commentStream = ObjectId;
    var fields = [
        {"something": {}},
        {"somethingElse": "test"},
        {},
        {}
    ];

    var samplePost = {
        postStream: postStream, name: name,
        icon: icon, commentStream: commentStream, fields: fields
    };

    describe('POST ' + rootUrl, function () {
        afterEach(function () {
            mockgoose.reset();
        });

        it('responds with 200 and json', function (done) {
            request(app)
                .post(rootUrl)
                .send(samplePost)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201, function (err, res) {
                    var post = res.body.post;
                    res.headers.location.should.equal(rootUrl + '/' + post._id);
                    post.postStream.should.equal(postStream.toString());
                    post.name.should.equal(name);
                    post.icon.should.equal(icon);
                    post.commentStream[0].should.eql(commentStream.toString());
                    post.fields.length.should.equal(fields.length);
                    done(err);
                });
        });
    });

    describe('GET ' + rootUrl, function () {
        var post = {};
        var otherPost = {};

        beforeEach(function (done) {
            request(app)
                .post(rootUrl)
                .send(samplePost)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function (err, res) {
                    post = res.body.post;
                    res.headers.location.should.equal(rootUrl + '/' + post._id);
                    request(app)
                        .post(rootUrl)
                        .send(samplePost)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(201)
                        .end(function (err, res) {
                            otherPost = res.body.post;
                            res.headers.location.should.equal(rootUrl + '/' + otherPost._id);
                            done(err);
                        });
                });
        });

        afterEach(function () {
            mockgoose.reset();
        });


        it('responds with 200 and json', function (done) {
            request(app)
                .get(rootUrl + '/' + post._id)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('PUT ' + rootUrl, function () {
        var post = {};
        var resourceUrl;

        beforeEach(function (done) {
            request(app)
                .post(rootUrl)
                .send(samplePost)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function (err, res) {
                    post = res.body.post;
                    res.headers.location.should.equal(rootUrl + '/' + post._id);
                    resourceUrl = res.headers.location;
                    done(err);
                });
        });

        afterEach(function () {
            mockgoose.reset();
        });

        it('responds with 200 and the updated json', function (done) {
            var nameUpdated = 'content updated';
            post.name = nameUpdated;
            request(app)
                .put(resourceUrl)
                .send(post)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('DELETE ' + rootUrl, function () {
        var post = {};
        var resourceUrl;

        beforeEach(function (done) {
            request(app)
                .post(rootUrl)
                .send(samplePost)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function (err, res) {
                    post = res.body.post;
                    res.headers.location.should.equal(rootUrl + '/' + post._id);
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

