/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var specUtil = require('../../spec-util');
var appSpecUtil = require('./app-spec-util');

describe('Application deletion', function () {
    var appLib;

    before(function () {
        appLib = require(global.config.apps.APP);
    });

    afterEach(function (done) {
        specUtil.dropDatabase(done);
    });


    describe('Deleting post', function () {
        it('should delete the post', function (done) {
            var testApp = appSpecUtil.getMockValidApp();
            appLib.createApp(testApp, function (err, app) {
                if (err) return done(err);
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
                                done();
                            });
                        });
                    });
                });

            });
        });
        it('should give an error if the post to be deleted does not exist', function (done) {
            var testApp = appSpecUtil.getMockValidApp();
            appLib.createApp(testApp, function (err, app) {
                if (err) return done(err);
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