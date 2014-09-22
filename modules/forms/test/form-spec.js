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
var formRoutes = require('../routes/formRoutes');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var rootUrl = '/' + rootUrls.forms;
app.use('/forms', formRoutes);

describe('Form API', function () {
    // Some test data
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
    var postStream = ObjectId;
    var sampleForm = {
        displayName: displayName, title: title, icon: icon,
        description: description, btnLabel: btnLabel,
        settings: settings, fields: fields, formEvents: formEvents,
        postStream: postStream
    };

    describe('POST ' + rootUrl, function () {
        afterEach(function () {
            mockgoose.reset();
        });

        it('responds with 200 and json', function (done) {
            request(app)
                .post(rootUrl)
                .send(sampleForm)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201, function (err, res) {
                    var form = res.body.form;
                    res.headers.location.should.equal(rootUrl + '/' + form._id);
                    form.displayName.should.equal(displayName);
                    done(err);
                });
        });
    });

    describe('GET ' + rootUrl, function () {
        var form = {};
        var otherForm = {};

        beforeEach(function (done) {
            request(app)
                .post(rootUrl)
                .send(sampleForm)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function (err, res) {
                    form = res.body.form;
                    res.headers.location.should.equal(rootUrl + '/' + form._id);
                    request(app)
                        .post(rootUrl)
                        .send(sampleForm)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(201)
                        .end(function (err, res) {
                            otherForm = res.body.form;
                            res.headers.location.should.equal(rootUrl + '/' + otherForm._id);
                            done(err);
                        });
                });
        });

        afterEach(function () {
            mockgoose.reset();
        });


        it('responds with 200 and json', function (done) {
            request(app)
                .get(rootUrl + '/' + form._id)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('PUT ' + rootUrl, function () {
        var form = {};
        var resourceUrl;

        beforeEach(function (done) {
            request(app)
                .post(rootUrl)
                .send(sampleForm)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function (err, res) {
                    form = res.body.form;
                    res.headers.location.should.equal(rootUrl + '/' + form._id);
                    resourceUrl = res.headers.location;
                    done(err);
                });
        });

        afterEach(function () {
            mockgoose.reset();
        });

        it('responds with 200 and the updated json', function (done) {
            var titleUpdated = 'form title updated';
            var iconUpdated = 'www.fooforms.com/iconUpdated.png';
            var descriptionUpdated = 'the form description updated';
            var btnLabelUpdated = 'the button label updated';
            form.title = titleUpdated;
            form.icon = iconUpdated;
            form.description = descriptionUpdated;
            form.btnLabel = btnLabelUpdated;
            request(app)
                .put(resourceUrl)
                .send(form)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

     describe('DELETE ' + rootUrl, function () {
        var form = {};
         var resourceUrl;

        beforeEach(function (done) {
            request(app)
                .post(rootUrl)
                .send(sampleForm)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function (err, res) {
                    form = res.body.form;
                    res.headers.location.should.equal(rootUrl + '/' + form._id);
                    resourceUrl = res.headers.location;
                    done(err);
                });
        });

        afterEach(function () {
            mockgoose.reset();
        });

        it('successfully deletes a form', function (done) {
           request(app)
               .delete(resourceUrl)
               .expect(204, done);
        });

    });
});

