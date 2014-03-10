/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var testUtil = require('../../spec-util');
var cloudSpecUtil = require('./cloud-spec-util');

describe('Querying Cloud Library to get Clouds and Cloud details', function () {
    var database;
    var cloudLib;

    before(function () {
        testUtil.init();
        database = require(global.config.apps.DATABASE);
        cloudLib = require(global.config.apps.CLOUD);
    });

    after(function () {
        testUtil.tearDown();
    });

    afterEach(function (done) {
        testUtil.dropDatabase(database, done);
    });

    describe('Cloud retrieval', function () {
        it('should return all clouds in the database');
        it('should find a cloud based on the user Id');
    });

    describe('Cloud Apps retrieval', function () {
        it('should get all apps belonging to a cloud');
        it('should get a list of app names belonging to a cloud');
    });

    describe('Cloud Member retrieval', function () {
        it('should get the clouds owner');
        it('should get a list of cloud members');
        it('should get a list of all members with write permissions');
    });


});