/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var specUtil = require('../../spec-util');
var appSpecUtil = require('./app-spec-util');
var userSpecUtil = require('../user/user-spec-util');

describe('Application Post functions', function () {
    var appLib;
    var userLib;

    before(function () {
        appLib = require(global.config.apps.APP);
        userLib = require(global.config.apps.USER);
    });

    afterEach(function (done) {
        specUtil.dropDatabase(done);
    });

    var createTestApp = function (next) {
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
                next(app);
            });
        });
    };


    describe('Creating a Post', function (done) {
        it('with valid entries should save without error', function (done) {
            createTestApp(function (app) {
                var testPost = appSpecUtil.getMockValidPost();
                appLib.createPost(testPost, app._id, function (err, post) {
                    if(err) return done(err);
                    should.exist(post);
                    post.name.should.equal(testPost.name);
                    post.description.should.equal(testPost.description);
                    post.icon.should.equal(testPost.icon);
                    post.menuLabel.should.equal(testPost.menuLabel);
                    post.fields.should.equal(testPost.fields);
                    post.app.should.eql(app._id);
                    appLib.getAppById(app._id, function (err, app) {
                        if(err) return done(err);
                        should.exist(app);
                        should.exist(app.posts);
                        app.posts.indexOf(post._id).should.not.equal(-1);
                        done();
                    });
                });

            });
        });
        it('with invalid entries should not save and report an error');
    });
    describe('Deleting post', function () {
        it('should delete the post', function (done) {
            createTestApp(function (app) {
                var testPost = appSpecUtil.getMockValidPost();
                appLib.createPost(testPost, app._id, function (err, post) {
                    if (err) return done(err);
                    should.exist(post);
                    post.app.should.eql(app._id);
                    appLib.getAppById(app._id, function (err, app) {
                        if (err) return done(err);
                        should.exist(app);
                        should.exist(app.posts);
                        app.posts.indexOf(post._id).should.not.equal(-1);
                        var postId = post._id;
                        appLib.deletePostById(post._id, function (err, post) {
                            if (err) return done(err);
                            should.not.exist(post);
                            appLib.getAppById(app._id, function (err, app) {
                                if (err) return done(err);
                                should.exist(app);
                                should.exist(app.posts);
                                app.posts.indexOf(postId).should.equal(-1);
                                done();
                            });
                        });
                    });
                });

            });
        });
        it('should give an error if the post to be deleted does not exist', function (done) {
            createTestApp(function (app) {
                should.exist(app);
                var testPost = appSpecUtil.getMockValidPost();
                appLib.createPost(testPost, app._id, function (err, post) {
                    if (err) return done(err);
                    should.exist(post);
                    post.app.should.eql(app._id);
                    appLib.getAppById(app._id, function (err, app) {
                        if (err) return done(err);
                        should.exist(app);
                        should.exist(app.posts);
                        app.posts.indexOf(post._id).should.not.equal(-1);
                        var postId = post._id;
                        appLib.deletePostById(post._id, function (err, post) {
                            if (err) return done(err);
                            should.not.exist(post);
                            appLib.getAppById(app._id, function (err, app) {
                                if (err) return done(err);
                                should.exist(app);
                                should.exist(app.posts);
                                app.posts.indexOf(postId).should.equal(-1);
                                appLib.deletePostById(postId, function (err, post) {
                                    should.exist(err);
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