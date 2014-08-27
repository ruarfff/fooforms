/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';
var path = require('path');
var should = require('should');
var specUtil = require('../spec-util');
var userSpecUtil = require('./user-spec-util');

describe('User creation', function () {
    var userLib;

    before(function () {
        userLib = require(global.config.modules.USER);
    });

    afterEach(function () {
        specUtil.dropDatabase();
    });

    describe('Getting a User profile', function () {
        it('should return a User profile with limited user data', function (done) {
            var testUser = userSpecUtil.getMockValidUser();
            userLib.createUser(testUser, function (err, user) {
                if (err) return done(err);
                should.exist(user);
                user.name.familyName.should.equal(testUser.name.familyName);
                user.name.givenName.should.equal(testUser.name.givenName);
                user.name.middleName.should.equal(testUser.name.middleName);
                user.displayName.should.equal(testUser.displayName.toLowerCase());
                user.password.should.not.equal(testUser.password); // Password get encrypted
                user.provider.should.equal('local');
                user.admin.should.equal(false);

                var profile = userLib.userToProfile(user);
                should.exist(profile);
                profile.id.should.eql(user._id);
                profile.name.should.equal(user.name);
                profile.displayName.should.equal(user.displayName);
                profile.photo.should.equal(user.photo);
                profile.email.should.equal(user.email);
                should.not.exist(profile.password);
                should.not.exist(profile.admin);
                should.not.exist(profile.provider);
                done();
            });
        });
    });
});