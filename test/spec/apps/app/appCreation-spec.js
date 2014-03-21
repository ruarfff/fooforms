/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var specUtil = require('../../spec-util');
var appSpecUtil = require('./app-spec-util');

describe('Application creation functions', function () {
    var appLib;


    before(function () {
        appLib = require(global.config.apps.APP);
    });

    afterEach(function (done) {
        specUtil.dropDatabase(done);
    });


    describe('Creating an app', function () {
        it('with valid entries should save without error', function (done) {
            var testApp = appSpecUtil.getMockValidApp();
            appLib.createApp(testApp, function (err, app) {
                if (err) return done(err);
                should.exist(app);
                done();
            });
        });
        it('with invalid entries should not save and report an error', function (done) {
            var testApp = appSpecUtil.getMockInvalidApp();
            appLib.createApp(testApp, function (err, app) {
                should.exist(err);
                should.not.exist(app);
                done();
            });
        });
    });


});