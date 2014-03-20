/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var testUtil = require('../../spec-util');

describe('Application Post functions', function () {
    var appLib;


    before(function () {
        appLib = require(global.config.apps.APP);
    });

    afterEach(function (done) {
        testUtil.dropDatabase(done);
    });


    describe('Creating a Post', function () {
        it('with valid entries should save without error');
        it('with invalid entries should not save and report an error');
    });


});