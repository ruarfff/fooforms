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
var commentRoutes = require('../routes/commentRoutes');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var rootUrl = '/' + rootUrls.comments;
app.use(rootUrl, commentRoutes);

describe('Comment API', function () {
    // Some test data
    var commenter = ObjectId;
    var content = 'some content';
    var commentStream = ObjectId;

    var sampleComment = {
        commentStream: commentStream, content: content, commenter: commenter
    };

    describe('POST ' + rootUrl, function () {
        afterEach(function () {
            mockgoose.reset();
        });

        it('responds with 200 and json', function (done) {
            request(app)
                .post(rootUrl)
                .send(sampleComment)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201, function (err, res) {
                    var comment = res.body.comment;
                    res.headers.location.should.equal(rootUrl + '/' + comment._id);
                    comment.commenter.should.equal(commenter.toString());
                    comment.content.should.equal(content);
                    comment.commentStream.should.eql(commentStream.toString());
                    done(err);
                });
        });
    });

    describe('GET ' + rootUrl, function () {
        var comment = {};
        var otherComment = {};

        beforeEach(function (done) {
            request(app)
                .post(rootUrl)
                .send(sampleComment)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function (err, res) {
                    comment = res.body.comment;
                    res.headers.location.should.equal(rootUrl + '/' + comment._id);
                    request(app)
                        .post(rootUrl)
                        .send(sampleComment)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(201)
                        .end(function (err, res) {
                            otherComment = res.body.comment;
                            res.headers.location.should.equal(rootUrl + '/' + otherComment._id);
                            done(err);
                        });
                });
        });

        afterEach(function () {
            mockgoose.reset();
        });


        it('responds with 200 and json', function (done) {
            request(app)
                .get(rootUrl + '/' + comment._id)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('PUT ' + rootUrl, function () {
        var comment = {};
        var resourceUrl;

        beforeEach(function (done) {
            request(app)
                .post(rootUrl)
                .send(sampleComment)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function (err, res) {
                    comment = res.body.comment;
                    res.headers.location.should.equal(rootUrl + '/' + comment._id);
                    resourceUrl = res.headers.location;
                    done(err);
                });
        });

        afterEach(function () {
            mockgoose.reset();
        });

        it('responds with 200 and the updated json', function (done) {
            var contentUpdated = 'content updated';
            comment.content = contentUpdated;
            request(app)
                .put(resourceUrl)
                .send(comment)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('DELETE ' + rootUrl, function () {
        var comment = {};
        var resourceUrl;

        beforeEach(function (done) {
            request(app)
                .post(rootUrl)
                .send(sampleComment)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function (err, res) {
                    comment = res.body.comment;
                    res.headers.location.should.equal(rootUrl + '/' + comment._id);
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

