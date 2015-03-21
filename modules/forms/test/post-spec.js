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
var postRoutes = require('../routes/postRoutes');

var FooForm = require('fooforms-forms');
var db = require('mongoose').connection;
var fooForm = new FooForm(db);


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var rootUrl = '/' + rootUrls.posts;
app.use(rootUrl, postRoutes);

describe('Post API', function () {
    // Some test data
    var samplePost; // Gets set in beforeEach
    var postStream;
    var displayName = 'post';
    var icon = 'www.fooforms.com/icon.png';
    var fields = [
        {"something": {}},
        {"somethingElse": "test"},
        {},
        {}
    ];

    beforeEach(function (done) {
        var title = 'form title';
        var description = 'the form description';
        var btnLabel = 'the button label';
        var formEvents = [];
        var folder;
        var settings = {"setting": {}, "something": [], "something-else": "test"};
        var sampleForm = {
            displayName: displayName, title: title, icon: icon,
            description: description, btnLabel: btnLabel,
            settings: settings, fields: fields, formEvents: formEvents,
            owner: ObjectId
        };

        var testFolder = {displayName: 'aFolder'};

        var folderModel = new fooForm.Folder(testFolder);
        folderModel.save(function (err, savedFolder) {
            should.not.exist(err);
            should.exist(savedFolder);
            folder = savedFolder;
            sampleForm.folder = folder;
            fooForm.createForm(sampleForm, function (err, result) {
                should.not.exist(err);
                result.success.should.equal(true);
                postStream = result.form.postStreams[0];
                samplePost = {
                    postStream: postStream, displayName: displayName,
                    icon: icon, fields: fields, formId: result.form._id
                };
                done(err);
            });
        });

    });


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
                    var post = res.body;
                    res.headers.location.should.equal(rootUrl + '/' + post._id);
                    post.postStream.should.equal(postStream.toString());
                    post.displayName.should.equal(displayName);
                    post.icon.should.equal(icon);
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
                    post = res.body;
                    res.headers.location.should.equal(rootUrl + '/' + post._id);
                    request(app)
                        .post(rootUrl)
                        .send(samplePost)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(201)
                        .end(function (err, res) {
                            otherPost = res.body;
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
                    post = res.body;
                    post.formId = ObjectId;
                    res.headers.location.should.equal(rootUrl + '/' + post._id);
                    resourceUrl = res.headers.location;
                    done(err);
                });
        });

        afterEach(function () {
            mockgoose.reset();
        });

        it('responds with 200 and the updated json', function (done) {
            post.displayName = 'content updated';
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
                    post = res.body;
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
                .send(post)
                .expect(204, done);
        });

    });
});

