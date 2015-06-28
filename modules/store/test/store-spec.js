/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

var path = require('path');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId();
var mockgoose = require('mockgoose');
mockgoose(mongoose);
var db = mongoose.connection;

var request = require('supertest');
var express = require('express');
var bodyParser = require('body-parser');
var should = require('should');
var assert = require('assert');

var rootUrls = require(path.resolve(__dirname, '../../../config/rootUrls'));
var storeRoutes = require(path.resolve(__dirname, '../routes/storeApiRoutes'));
var sampleStoreCreator = require('./sampleStoreCreator');

var _ = require('lodash');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var rootUrl = '/' + rootUrls.store;

app.use(rootUrl, storeRoutes);


describe('Store API', function () {

    before(function () {
        mockgoose.reset();
    });

    afterEach(function () {
        mockgoose.reset();
    });

    it('sample store creator actually should work', function (done) {
        sampleStoreCreator.generateStore(db, function (err, storeOrg) {
            should.exist(storeOrg);
            storeOrg.displayName.should.equal('formstore');
            storeOrg.teams.length.should.equal(3);
            for (var i = 0; i < storeOrg.teams.length; i++) {
                should.exist(storeOrg.teams[i].folders[0]);
                should.exist(storeOrg.teams[i].folders[0].forms);
                storeOrg.teams[i].folders[0].forms.length.should.equal(1);
                storeOrg.teams[i].folders[0].forms[0].displayName.should.equal('form');
            }
            done(err);
        });
    });

    describe('GET ' + rootUrl, function () {
        it('should return a fully populated store org', function (done) {
            sampleStoreCreator.generateStore(db, function (err, storeOrg) {
                should.not.exist(err);
                request(app)
                    .get(rootUrl)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200).end(function (err, res) {
                        var store = res.body;
                        should.exist(store);
                        store.displayName.should.equal('formstore');
                        store.teams.length.should.equal(3);
                        for (var i = 0; i < store.teams.length; i++) {
                            should.exist(store.teams[i].folders[0]);
                            should.exist(store.teams[i].folders[0].forms);
                            store.teams[i].folders[0].forms.length.should.equal(1);
                            store.teams[i].folders[0].forms[0].displayName.should.equal('form');
                        }
                        done(err);
                    });
            });
        });
    });

});



