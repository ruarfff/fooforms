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
var commentRoutes = require('../routes/commentRoutes');

var FooForm = require('fooforms-forms');
var db = require('mongoose').connection;
var fooForm = new FooForm(db);

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
    var name = 'post';
    var icon = 'www.fooforms.com/icon.png';
    var fields = [
        {"something": {}},
        {"somethingElse": "test"},
        {},
        {}
    ];

    var commentStream;
    var sampleComment;

    beforeEach(function (done) {
        var displayName = 'form';
        var title = 'form title';
        var icon = 'www.fooforms.com/icon.png';
        var description = 'the form description';
        var btnLabel = 'the button label';
        var formEvents = [
            {}
        ];
        var settings = {"setting": {}, "something": [], "something-else": "test"};
        var fields = [
            {},
            {},
            {}
        ];
        var sampleForm = {
            displayName: displayName, title: title, icon: icon,
            description: description, btnLabel: btnLabel,
            settings: settings, fields: fields, formEvents: formEvents
        };
        var samplePost = {
            name: name,
            icon: icon, fields: fields
        };
        var testFolder = {displayName: 'aFolder'};

        var folder = new fooForm.Folder(testFolder);

        folder.save(function (err, savedFolder) {
            should.not.exist(err);
            sampleForm.folder = savedFolder;
            fooForm.createForm(sampleForm, function (err, result) {
                should.not.exist(err);
                result.success.should.equal(true);
                samplePost.postStream = result.form.postStreams[0];
                fooForm.createPost(samplePost, function (err, result) {
                    should.not.exist(err);
                    result.success.should.equal(true);
                    commentStream = result.post.commentStreams[0];
                    sampleComment = {
                        commentStream: commentStream, content: content, commenter: commenter
                    };
                    done(err);
                });
            });
        });

    });

    afterEach(function () {
        mockgoose.reset();
    });

    describe('POST ' + rootUrl, function () {

        it('responds with 200 and json', function (done) {
            request(app)
                .post(rootUrl)
                .send(sampleComment)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201, function (err, res) {
                    var comment = res.body;
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
                    comment = res.body;
                    res.headers.location.should.equal(rootUrl + '/' + comment._id);
                    request(app)
                        .post(rootUrl)
                        .send(sampleComment)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(201)
                        .end(function (err, res) {
                            otherComment = res.body;
                            res.headers.location.should.equal(rootUrl + '/' + otherComment._id);
                            done(err);
                        });
                });
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
                    comment = res.body;
                    res.headers.location.should.equal(rootUrl + '/' + comment._id);
                    resourceUrl = res.headers.location;
                    done(err);
                });
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
                    comment = res.body;
                    res.headers.location.should.equal(rootUrl + '/' + comment._id);
                    resourceUrl = res.headers.location;
                    done(err);
                });
        });

        it('successfully deletes', function (done) {
            request(app)
                .delete(rootUrl)
                .send(comment)
                .expect(204, done);
        });

    });
});

