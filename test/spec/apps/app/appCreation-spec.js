/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var specUtil = require('../../spec-util');
var appSpecUtil = require('./app-spec-util');
var userSpecUtil = require('../user/user-spec-util');

describe('Application creation functions', function () {
    var appLib;
    var userLib;


    before(function () {
        appLib = require(global.config.apps.APP);
        userLib = require(global.config.apps.USER);
    });

    afterEach(function (done) {
        specUtil.dropDatabase(done);
    });


    describe('Creating an app', function () {
        it('with valid entries should save without error', function (done) {
            var testUser = userSpecUtil.getMockValidUser();
            userLib.createUser(testUser, function (err, user) {
                if (err) return done(err);
                should.exist(user);
                var testApp = appSpecUtil.getMockValidApp();
                testApp.owner = user._id;
                appLib.createApp(testApp, function (err, app) {
                    if (err) return done(err);
                    should.exist(app);
                    app.owner.should.eql(user._id);
                    app.cloud.should.eql(user.cloud);
                    app.name.should.equal(testApp.name);
                    app.icon.should.equal(testApp.icon);
                    app.description.should.equal(testApp.description);
                    app.menuLabel.should.equal(testApp.menuLabel);
                    app.btnLabel.should.equal(testApp.btnLabel);
                    app.settings.should.eql(testApp.settings);
                    app.fields.should.be.instanceof(Array).and.have.lengthOf(testApp.fields.length);
                    done();
                });
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