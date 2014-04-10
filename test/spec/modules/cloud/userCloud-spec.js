/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var testUtil = require('../../spec-util');
var log = require(global.config.modules.LOGGING).LOG;

var User = require(global.config.modules.USER).User;
var Cloud = require(global.config.modules.CLOUD).Cloud;

describe('Cloud creation', function () {
    var cloudLib;
    var userLib;

    var sampleUser = {};
    var sampleUserAsMember = {};
    var sampleUserCloud = {};

    before(function () {
        cloudLib = require(global.config.modules.CLOUD);
        userLib = require(global.config.modules.USER);
    });

    beforeEach(function () {
        sampleUser = {
            name: {
                familyName: "Test Family Name",
                givenName: "testGivenName",
                middleName: "_*^%$£@!"
            },
            displayName: "user1",
            email: "testEmail1@email.com",
            password: "testPassword"
        };
        sampleUserAsMember = {
            name: {
                familyName: "Bon",
                givenName: "John",
                middleName: "hskjhdkfjh"
            },
            displayName: "user2",
            email: "testEmail1@email.com",
            password: "testPassword"
        };
    });

    afterEach(function (done) {
        testUtil.dropDatabase(done);
    });

    describe('Creating a User cloud', function () {
        it('should create a User Cloud', function (done) {
            userLib.createUser(sampleUser, function (err, user) {
                if (err) return done(err);
                should.exist(user);
                cloudLib.getCloudById(user.cloud, function (err, cloud) {
                    if (err) return done(err);
                    should.exist(cloud);
                    cloud.name.should.equal(user.displayName);
                    cloud.owner.should.eql(user._id);
                    cloud.menuLabel.should.equal(user.displayName);
                    cloud.icon.should.equal(user.photo);
                    should(cloud.isPrivate).ok;
                    should(cloud.isUserCloud).ok;
                    should(cloud.members.length === 0).ok;
                    should(cloud.membersWithWritePermissions.length === 0).ok;
                    done();
                });
            });
        });
    });

    describe('Updating a User Cloud', function () {

        it('should not allow addition of members', function (done) {
            userLib.createUser(sampleUserAsMember, function (err, member) {
                if (err) {
                    return done(err);
                }
                should.exist(member);
                userLib.createUser(sampleUser, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(user._id);
                    cloudLib.getCloudById(user.cloud, function (err, cloud) {
                        if (err) done(err);
                        should(cloud.isUserCloud).ok;
                        cloud.owner.should.eql(user._id);
                        should(cloud.members.length === 0).ok;
                        should(cloud.membersWithWritePermissions.length === 0).ok;

                        cloudLib.addCloudMember(cloud._id, member._id, function (err, cloud) {
                            should.exist(err);
                            should.exist(cloud);
                            should(cloud.members.length === 0).ok;
                            should(cloud.membersWithWritePermissions.length === 0).ok;
                            done();
                        });
                    });

                });
            });
        });
        it('should not allow addition of members with write permissions', function (done) {
            userLib.createUser(sampleUserAsMember, function (err, member) {
                if (err) {
                    return done(err);
                }
                should.exist(member);
                userLib.createUser(sampleUser, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(user._id);
                    cloudLib.getCloudById(user.cloud, function (err, cloud) {
                        if (err) done(err);
                        should(cloud.isUserCloud).ok;
                        cloud.owner.should.eql(user._id);
                        should(cloud.members.length === 0).ok;
                        should(cloud.membersWithWritePermissions.length === 0).ok;

                        cloudLib.addCloudMemberWithWritePermissions(cloud._id, member._id, function (err, cloud) {
                            should.exist(err);
                            should.exist(cloud);
                            should(cloud.members.length === 0).ok;
                            should(cloud.membersWithWritePermissions.length === 0).ok;
                            done();
                        });
                    });

                });
            });
        });
    });
});