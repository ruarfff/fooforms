/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var specUtil = require('../../spec-util');
var appSpecUtil = require('./app-spec-util');
var userSpecUtil = require('../user/user-spec-util');
var log = require(global.config.modules.LOGGING).LOG;

describe('Application deletion', function () {
    var appLib;
    var userLib;

    before(function () {
        appLib = require(global.config.modules.APP);
        userLib = require(global.config.modules.USER);
    });

    afterEach(function (done) {
        specUtil.dropDatabase(done);
    });


    describe('Deleting an app', function () {
        it('should delete an app and all associated posts', function (done) {
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
                    app.owner.should.eql(user._id);
                    var testPost1 = appSpecUtil.getMockValidPost();
                    var testPost2 = appSpecUtil.getMockValidPost();
                    appLib.createPost(testPost1, app._id, function (err, post1) {
                        if (err) {
                            return done(err);
                        }
                        should.exist(post1);
                        appLib.createPost(testPost2, app._id, function (err, post2) {
                            if (err) {
                                return done(err);
                            }
                            should.exist(post2);
                            appLib.getAppById(app._id, function (err, app) {
                                if (err) {
                                    return done(err);
                                }
                                should.exist(app);
                                appLib.deleteAppById(app._id, function (err, app) {
                                    if (err) {
                                        return done(err);
                                    }
                                    should.not.exist(app);
                                    appLib.getPostById(post1._id, function (err, post) {
                                        if (err) {
                                            return done(err);
                                        }
                                        should.not.exist(post);
                                        appLib.getPostById(post2._id, function (err, post) {
                                            if (err) {
                                                log.debug('69');
                                                return done(err);
                                            }
                                            should.not.exist(post);
                                            done();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

});