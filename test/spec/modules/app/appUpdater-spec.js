/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var specUtil = require('../../spec-util');
var appSpecUtil = require('./app-spec-util');
var userSpecUtil = require('../user/user-spec-util');

describe('Application updating', function () {
    var appLib;
    var userLib;

    before(function () {
        appLib = require(global.config.modules.APP);
        userLib = require(global.config.modules.USER);
    });

    afterEach(function (done) {
        specUtil.dropDatabase(done);
    });


    describe('Update an app', function () {
        it('should update an app if it exists', function (done) {
            var testUser = userSpecUtil.getMockValidUser();
            userLib.createUser(testUser, function (err, user) {
                if (err) {
                    return done(err);
                }
                should.exist(user);
                var testApp = appSpecUtil.getMockValidApp();
                testApp.owner = user._id;
                appLib.createApp(testApp, function (err, app) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(app);
                    var newAppContent = appSpecUtil.getMockValidApp();
                    app.name = newAppContent.name;
                    app.icon = newAppContent.icon;
                    app.btnLabel = newAppContent.btnLabel;
                    app.description = newAppContent.description;
                    app.menuLabel = newAppContent.menuLabel;
                    app.fields = newAppContent.fields;
                    app.formEvents = newAppContent.formEvents;
                    app.sharing = newAppContent.sharing;
                    app.privileges = newAppContent.privileges;

                    appLib.updateApp(app, function (err, updatedApp) {
                        should.not.exist(err);
                        should.exist(updatedApp);
                        updatedApp.name.should.equal(newAppContent.name);
                        updatedApp.icon.should.equal(newAppContent.icon);
                        updatedApp.btnLabel.should.equal(newAppContent.btnLabel);
                        updatedApp.description.should.equal(newAppContent.description);
                        updatedApp.menuLabel.should.equal(newAppContent.menuLabel);
                        updatedApp.should.have.property('fields').with.lengthOf(newAppContent.fields.length);
                        updatedApp.should.have.property('formEvents').with.lengthOf(newAppContent.formEvents.length);
                        updatedApp.sharing.should.eql(newAppContent.sharing);
                        updatedApp.privileges.should.equal(newAppContent.privileges);
                        done();
                    });
                });
            });
        });
    });

});