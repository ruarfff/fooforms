/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var testUtil = require('../../spec-util');

describe('Application creation functions', function () {
    var database;
    var appLib;


    before(function () {
        database = require(global.config.apps.DATABASE);
        appLib = require(global.config.apps.APP);
    });

    afterEach(function (done) {
        testUtil.dropDatabase(database, done);
    });


    describe('Creating an app', function () {
        it('with valid entries should save without error');
        it('with invalid entries should not save and report an error');
    });


});