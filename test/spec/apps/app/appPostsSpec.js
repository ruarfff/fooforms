/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var specUtil = require('../../spec-util');
var appSpecUtil = require('./app-spec-util');

describe('Application Post functions', function () {
    var appLib;

    before(function () {
        appLib = require(global.config.apps.APP);
    });

    afterEach(function (done) {
        specUtil.dropDatabase(done);
    });


    describe('Creating a Post', function (done) {
        it('with valid entries should save without error', function (done) {
            var testApp = appSpecUtil.getMockValidApp();
            appLib.createApp(testApp, function (err, app) {
                if (err) return done(err);
                should.exist(app);
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


});