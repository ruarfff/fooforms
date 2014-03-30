/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var testUtil = require('../../spec-util');
var cloudSpecUtil = require('./cloud-spec-util');
var log = require(global.config.apps.LOGGING).LOG;


describe('Cloud creation', function () {
    var cloudLib;

    before(function () {
        cloudLib = require(global.config.apps.CLOUD);
    });

    beforeEach(function (done) {
        cloudSpecUtil.seedCloudsInDatabase(done);
    });

    afterEach(function (done) {
        testUtil.dropDatabase(done);
    });

    describe('Deleting a cloud', function () {
        it.skip('should delete a Cloud and all apps within', function (done) {

        });
    });

});