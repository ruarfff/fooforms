/*jslint node: true */
'use strict';
var assert = require("assert");

var path = require('path');
var should = require('should');
var testUtil = require('../../spec-util');

describe('Application creation funcitons', function () {
    var database;
    var appLib;


    before(function () {
        testUtil.init();
        database = require(global.config.apps.DATABASE);
        appLib = require(global.config.apps.APP);
    });

    after(function () {
        testUtil.tearDown();
    });

    afterEach(function (done) {
        testUtil.dropDatabase(database, done);
    });


    describe('Creating an app', function () {
        it('with valid entries should save without error');
        it('with invalid entries should not save and report an error');
    });


});