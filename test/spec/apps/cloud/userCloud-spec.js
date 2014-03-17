/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var testUtil = require('../../spec-util');
var log = require(global.config.apps.LOGGING).LOG;

var User = require(global.config.apps.USER).User;
var Cloud = require(global.config.apps.CLOUD).Cloud;

describe('Cloud creation', function () {
    var database;
    var cloudLib;
    var userLib;

    var sampleUser = {};
    var sampleUserAsMember = {};
    var sampleUserCloud = {};

    before(function () {
        testUtil.init();
        database = require(global.config.apps.DATABASE);
        cloudLib = require(global.config.apps.CLOUD);
        userLib = require(global.config.apps.USER);
    });

    after(function () {
        testUtil.tearDown();
    });

    beforeEach(function (done) {
        testUtil.openDatabase(database, done);
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
        sampleUserCloud = {
            name: "sampleCloud",
            description: "A sample cloud",
            icon: "some/icon.png",
            isUserCloud: true
        };
    });

    afterEach(function (done) {
        testUtil.dropDatabase(database, done);
    });

    describe('Creating a User cloud with valid inputs', function () {


        it('should create a User Cloud', function (done) {

            userLib.createUserLocalStrategy(sampleUser, function (err, user) {
                if (err) {
                    return done(err);
                }
                should.exist(user._id);
                sampleUserCloud.owner = user._id;
                cloudLib.createCloud(sampleUserCloud, function (err, cloud) {
                    if (err) {
                        done(err);
                    }
                    cloud.name.should.equal(sampleUserCloud.name);
                    cloud.description.should.equal(sampleUserCloud.description);
                    cloud.icon.should.equal(sampleUserCloud.icon);
                    should(cloud.isUserCloud).ok;
                    cloud.owner.should.equal(user._id);
                    should(cloud.members.length === 0).ok;
                    should(cloud.membersWithWritePermissions.length === 0).ok;
                    done();
                });

            });

        });
        it('should not create a User Cloud with members', function (done) {
            userLib.createUserLocalStrategy(sampleUserAsMember, function (err, member) {
                if (err) {
                    return done(err);
                }
                should.exist(member);
                userLib.createUserLocalStrategy(sampleUser, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(user._id);
                    sampleUserCloud.owner = user._id;
                    sampleUserCloud.members = [member._id];
                    cloudLib.createCloud(sampleUserCloud, function (err, cloud) {
                        should.exist(err);
                        should.not.exist(cloud);
                        done();
                    });

                });
            });
        });
        it('should not create a User Cloud with members with write permissions', function (done) {
            userLib.createUserLocalStrategy(sampleUserAsMember, function (err, member) {
                if (err) {
                    return done(err);
                }
                should.exist(member);
                userLib.createUserLocalStrategy(sampleUser, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(user._id);
                    sampleUserCloud.owner = user._id;
                    sampleUserCloud.membersWithWritePermissions = [member._id];
                    cloudLib.createCloud(sampleUserCloud, function (err, cloud) {
                        should.exist(err);
                        should.not.exist(cloud);
                        done();
                    });

                });
            });
        });

    });

    describe.skip('Updating and Creating a User Cloud with invalid inputs', function () {

        it('should not allow addition of members', function (done) {

            userLib.createUserLocalStrategy(sampleUserAsMember, function (err, member) {
                if (err) {
                    return done(err);
                }
                should.exist(member);
                userLib.createUserLocalStrategy(sampleUser, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(user._id);
                    sampleUserCloud.owner = user._id;
                    cloudLib.createCloud(sampleUserCloud, function (err, cloud) {
                        if (err) {
                            done(err);
                        }
                        cloud.name.should.equal(sampleUserCloud.name);
                        cloud.description.should.equal(sampleUserCloud.description);
                        cloud.icon.should.equal(sampleUserCloud.icon);
                        should(cloud.isUserCloud).ok;
                        cloud.owner.should.equal(user._id);
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
            userLib.createUserLocalStrategy(sampleUserAsMember, function (err, member) {
                if (err) {
                    return done(err);
                }
                should.exist(member);
                userLib.createUserLocalStrategy(sampleUser, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(user._id);
                    sampleUserCloud.owner = user._id;
                    cloudLib.createCloud(sampleUserCloud, function (err, cloud) {
                        if (err) {
                            done(err);
                        }
                        cloud.name.should.equal(sampleUserCloud.name);
                        cloud.description.should.equal(sampleUserCloud.description);
                        cloud.icon.should.equal(sampleUserCloud.icon);
                        should(cloud.isUserCloud).ok;
                        cloud.owner.should.equal(user._id);
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
        it('should not save and give an error when owner is not provided', function (done) {
            sampleUserCloud.owner = null;
            cloudLib.createCloud(sampleUserCloud, function (err, cloud) {
                should.not.exist(cloud);
                should.exist(err);
                done();
            });
        });
    });
});