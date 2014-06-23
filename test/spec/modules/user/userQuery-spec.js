/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';
var path = require('path');
var should = require('should');
var specUtil = require('../spec-util');
var userSpecUtil = require('./user-spec-util');

describe('User query', function () {
    var userLib;

    before(function () {
        userLib = require(global.config.modules.USER);
    });

    afterEach(function (done) {
        specUtil.dropDatabase(done);
    });

    describe('Checking user displayname', function () {
        it('should return a User if displayname exists', function (done) {
            var testUser = userSpecUtil.getMockValidUser();
            userLib.createUser(testUser, function (err, user) {
                if (err) {
                    return done(err);
                }
                should.exist(user);
                user.displayName.should.equal(testUser.displayName.toLowerCase());

                userLib.findByDisplayName(user.displayName, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(user);
                    done();
                });
            });
        });
        it('should not return a User if displayname does not exists', function (done) {
            var testUser = userSpecUtil.getMockValidUser();
            userLib.findByDisplayName(testUser.displayName, function (err, user) {
                if (err) {
                    return done(err);
                }
                should.not.exist(user);
                done();
            });
        });
    });

    describe('Checking user email', function () {
        it('should return a User if email exists', function (done) {
            var testUser = userSpecUtil.getMockValidUser();
            userLib.createUser(testUser, function (err, user) {
                if (err) {
                    return done(err);
                }
                should.exist(user);
                user.email.should.equal(testUser.email);

                userLib.checkEmail(user.email, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(user);
                    done();
                });
            });
        });
        it('should not return a User if displayname does not exists', function (done) {
            var testUser = userSpecUtil.getMockValidUser();
            userLib.checkEmail(testUser.email, function (err, user) {
                if (err) {
                    return done(err);
                }
                should.not.exist(user);
                done();
            });

        });
    });
});