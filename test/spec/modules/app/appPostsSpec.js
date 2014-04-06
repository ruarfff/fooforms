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

    var createTestAppWithUser = function (next) {
        var testUser = userSpecUtil.getMockValidUser();
        userLib.createUser(testUser, function (err, user) {
            if (err) return next(err);
            should.exist(user);
            createTestApp(user._id, next);
        });
    };

    var createTestApp = function(userId, next) {
        var testApp = appSpecUtil.getMockValidApp();
        testApp.owner = userId;
        appLib.createApp(testApp, function (err, app) {
            if (err) return next(err);
            should.exist(app);
            app.owner.should.eql(userId);
            next(app);
        });
    };

    var createTestAppWithPosts = function (userId, next) {
        createTestApp(userId, function (app) {
            var testPost1 = appSpecUtil.getMockValidPost();
            var testPost2 = appSpecUtil.getMockValidPost();
            appLib.createPost(testPost1, app._id, function (err, post1) {
                if (err) return next(err);
                should.exist(post1);
                appLib.createPost(testPost2, app._id, function (err, post2) {
                    if (err) return next(err);
                    should.exist(post2);
                    appLib.getAppById(app._id, function (err, app) {
                        if (err) return next(err);
                        should.exist(app);
                        next(app);
                    });
                });
            });
        });
    };


    describe('Creating a Post', function () {
        it('with valid entries should save without error', function (done) {
            createTestAppWithUser(function (app) {
                var testPost = appSpecUtil.getMockValidPost();
                appLib.createPost(testPost, app._id, function (err, post) {
                    if (err) return done(err);
                    should.exist(post);
                    post.name.should.equal(testPost.name);
                    post.description.should.equal(testPost.description);
                    post.icon.should.equal(testPost.icon);
                    post.menuLabel.should.equal(testPost.menuLabel);
                    post.fields.should.be.instanceof(Array).and.have.lengthOf(testPost.fields.length);
                    post.app.should.eql(app._id);
                    appLib.getAppById(app._id, function (err, app) {
                        if (err) return done(err);
                        should.exist(app);
                        should.exist(app.posts);
                        app.posts.indexOf(post._id).should.not.equal(-1);
                        done();
                    });
                });
            });
        });
        it('with invalid app Id should not save and report an error', function (done) {
            var testPost = appSpecUtil.getMockValidPost();
            appLib.createPost(testPost, 'invalidId', function (err, post) {
                should.exist(err);
                should.not.exist(post);
                done();
            });

        });
    });
    describe('Deleting post', function () {
        it('should delete the post', function (done) {
            createTestAppWithUser(function (app) {
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
            createTestAppWithUser(function (app) {
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

    describe('Updating a post', function () {
        it('should update an existing post', function (done) {
            createTestAppWithUser(function (app) {
                var testPost = appSpecUtil.getMockValidPost();
                appLib.createPost(testPost, app._id, function (err, post) {
                    if (err) return done(err);
                    should.exist(post);
                    appLib.getAppById(app._id, function (err, app) {
                        if (err) return done(err);
                        should.exist(app);
                        should.exist(app.posts);
                        app.posts.indexOf(post._id).should.not.equal(-1);
                        appLib.getPostById(app.posts[app.posts.indexOf(post._id)], function (err, post) {
                            if (err) return done(err);
                            should.exist(post);
                            var updatingPost = post;
                            updatingPost.name = 'UpdatedName';
                            updatingPost.description = 'UpdatedDescription';
                            updatingPost.icon = 'UpdatedIcon';
                            updatingPost.menuLabel = 'UpdatedMenuLabel';
                            updatingPost.fields = [
                                {},
                                {}
                            ];

                            appLib.updatePost(updatingPost, function (err, post) {
                                if (err) return done(err);
                                should.exist(post);
                                post._id.should.eql(updatingPost._id);
                                post.name.should.equal(updatingPost.name);
                                post.description.should.equal(updatingPost.description);
                                post.icon.should.equal(updatingPost.icon);
                                post.menuLabel.should.equal(updatingPost.menuLabel);
                                post.fields.should.be.instanceof(Array).and.have.lengthOf(updatingPost.fields.length);
                                post.app.should.eql(app._id);
                                done();
                            });
                        });

                    });
                });
            });
        });
    });

    describe('Querying posts', function () {
        it('should find post by Id', function (done) {
            createTestAppWithUser(function (app) {
                var testPost = appSpecUtil.getMockValidPost();
                appLib.createPost(testPost, app._id, function (err, post) {
                    if (err) return done(err);
                    should.exist(post);
                    appLib.getAppById(app._id, function (err, app) {
                        if (err) return done(err);
                        should.exist(app);
                        should.exist(app.posts);
                        app.posts.indexOf(post._id).should.not.equal(-1);
                        appLib.getPostById(app.posts[app.posts.indexOf(post._id)], function (err, post) {
                            if (err) return done(err);
                            should.exist(post);
                            post.name.should.equal(testPost.name);
                            post.description.should.equal(testPost.description);
                            post.icon.should.equal(testPost.icon);
                            post.menuLabel.should.equal(testPost.menuLabel);
                            post.fields.should.be.instanceof(Array).and.have.lengthOf(testPost.fields.length);
                            post.app.should.eql(app._id);
                            done();
                        });
                    });
                });
            });
        });
        it('should not find a post by Id and return an error if post does not exist', function (done) {
            appLib.getPostById('some invalid Id', function (err, post) {
                should.exist(err);
                should.not.exist(post);
                done();
            });
        });
        it('should get all post belonging to an app', function (done) {
            createTestAppWithUser(function (app) {
                var testPost1 = appSpecUtil.getMockValidPost();
                var testPost2 = appSpecUtil.getMockValidPost();
                appLib.createPost(testPost1, app._id, function (err, post1) {
                    if (err) return done(err);
                    should.exist(post1);
                    appLib.createPost(testPost2, app._id, function (err, post2) {
                        if (err) return done(err);
                        should.exist(post2);
                        appLib.getAppPosts(app._id, function (err, posts) {
                            posts.should.be.instanceof(Array).and.have.lengthOf(2);
                            var lookup = {};
                            for (var i = 0, len = posts.length; i < len; i++) {
                                lookup[posts[i]._id] = posts[i];
                            }
                            var post1Result = lookup[post1._id];
                            var post2Result = lookup[post2._id];
                            should.exist(post1Result);
                            should.exist(post2Result);

                            post1Result.name.should.equal(post1.name);
                            post1Result.description.should.equal(post1.description);
                            post1Result.icon.should.equal(post1.icon);
                            post1Result.menuLabel.should.equal(post1.menuLabel);
                            post1Result.fields.should.be.instanceof(Array).and.have.lengthOf(post1.fields.length);
                            post1Result.app.should.eql(app._id);

                            post2Result.name.should.equal(post2.name);
                            post2Result.description.should.equal(post2.description);
                            post2Result.icon.should.equal(post2.icon);
                            post2Result.menuLabel.should.equal(post2.menuLabel);
                            post2Result.fields.should.be.instanceof(Array).and.have.lengthOf(post2.fields.length);
                            post2Result.app.should.eql(app._id);

                            done();
                        });
                    });
                });
            });
        });
        it('should return an empty array if app has not posts', function (done) {
            createTestAppWithUser(function (app) {
                appLib.getAppPosts(app._id, function (err, posts) {
                    should.not.exist(err);
                    should.exist(posts);
                    posts.should.be.instanceof(Array).and.have.lengthOf(0);
                    done();
                });
            });
        });
        it('should get all posts belonging to a user', function (done) {
            var testUser = userSpecUtil.getMockValidUser();
            userLib.createUser(testUser, function (err, user) {
                if (err) return done(err);
                should.exist(user);
                createTestAppWithPosts(user._id, function (app) {
                    if (err) return done(err);
                    should.exist(app);
                    app.posts.should.be.instanceof(Array).and.have.lengthOf(2);
                    createTestAppWithPosts(user._id, function (app) {
                        if (err) return done(err);
                        should.exist(app);
                        app.posts.should.be.instanceof(Array).and.have.lengthOf(2);
                        appLib.getUserPosts(user._id, function (err, posts) {
                            should.not.exist(err);
                            should.exist(posts);
                            posts.should.be.instanceof(Array).and.have.lengthOf(4);
                            done();
                        });
                    });
                });
            });
        });
        it('should return an empty array if a user has no posts', function (done) {
                createTestAppWithUser(function (app) {
                    appLib.getUserPosts(app.owner, function (err, posts) {
                        should.not.exist(err);
                        should.exist(posts);
                        posts.should.be.instanceof(Array).and.have.lengthOf(0);
                        done();
                    });
                });
        });
        it('should get all posts related to a cloud');
        it('should return an empty array if cloud has no posts');
    });
});