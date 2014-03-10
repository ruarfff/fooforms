/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var testUtil = require('../../spec-util');
var cloudSpecUtil = require('./cloud-spec-util');

var User = require(global.config.apps.USER).User;
var App = require(global.config.apps.APP).App;
var Cloud = require(global.config.apps.CLOUD).Cloud;

describe('Cloud creation', function () {
    var database;
    var cloudLib;
    var userLib;

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
    });

    afterEach(function (done) {
        testUtil.dropDatabase(database, done);
    });

    describe('Creating a cloud with valid inputs', function () {

        var sampleUser = {
            name: {
                familyName: "Test Family Name",
                givenName: "testGivenName",
                middleName: "_*^%$£@!"
            },
            displayName: "sample-user",
            email: "testEmail1@email.com",
            password: "testPassword"
        };
        var sampleCloud = {
            name: "sampleCloud",
            description: "A sample cloud",
            icon: "some/icon.png"
        };


        it('should save without error', function (done) {

            userLib.createUserLocalStrategy(sampleUser, function (err, user) {
                if (err) {
                    done(err);
                } else {
                    should.exist(user._id);
                    sampleCloud.owner = user._id;
                    cloudLib.createCloud(sampleCloud, function (err, cloud) {
                        if (err) {
                            done(err);
                        }
                        cloud.name.should.equal(sampleCloud.name);
                        cloud.description.should.equal(sampleCloud.description);
                        cloud.icon.should.equal(sampleCloud.icon);
                        cloud.owner.should.equal(user._id);
                        done();
                    });
                }
            });

        });
        it('should save without error and have members', function (done) {
            userLib.createUserLocalStrategy(sampleUser, function (err, user) {
                if (err) {
                    done(err);
                } else {
                    should.exist(user._id);
                    User.create(cloudSpecUtil.sampleUsersJSONArray, function (err, user1, user2, user3, user4) {
                        if (err) {
                            done(err);
                        }
                        should.exist(user1._id);
                        should.exist(user2._id);
                        should.exist(user3._id);
                        should.exist(user4._id);
                        sampleCloud.owner = user._id;
                        var numberOfMemebers = 4;
                        sampleCloud.members = [user1._id, user2._id, user3._id, user4._id];
                        cloudLib.createCloud(sampleCloud, function (err, cloud) {
                            if (err) {
                                done(err);
                            }
                            cloud.name.should.equal(sampleCloud.name);
                            cloud.description.should.equal(sampleCloud.description);
                            cloud.icon.should.equal(sampleCloud.icon);
                            cloud.owner.should.equal(user._id);
                            cloud.should.have.property('members').with.lengthOf(numberOfMemebers);
                            should(cloud.members.indexOf(user1._id) > -1).ok;
                            should(cloud.members.indexOf(user2._id) > -1).ok;
                            should(cloud.members.indexOf(user3._id) > -1).ok;
                            should(cloud.members.indexOf(user4._id) > -1).ok;
                            done();
                        });
                    });
                }
            });

        });
        it('should save without error and have members with write permissions', function (done) {
            userLib.createUserLocalStrategy(sampleUser, function (err, user) {
                if (err) {
                    done(err);
                } else {
                    should.exist(user._id);
                    User.create(cloudSpecUtil.sampleUsersJSONArray, function (err, user1, user2, user3, user4) {
                        if (err) {
                            done(err);
                        }
                        should.exist(user1._id);
                        should.exist(user2._id);
                        should.exist(user3._id);
                        should.exist(user4._id);
                        sampleCloud.owner = user._id;
                        var numberOfMembersWithWritePermissions = 2;
                        sampleCloud.members = [user1._id, user2._id, user3._id, user4._id];
                        sampleCloud.membersWithWritePermissions = [user1._id, user2._id];
                        cloudLib.createCloud(sampleCloud, function (err, cloud) {
                            if (err) {
                                done(err);
                            }
                            cloud.name.should.equal(sampleCloud.name);
                            cloud.description.should.equal(sampleCloud.description);
                            cloud.icon.should.equal(sampleCloud.icon);
                            cloud.owner.should.equal(user._id);
                            cloud.should.have.property('membersWithWritePermissions').with.lengthOf(numberOfMembersWithWritePermissions);
                            should(cloud.membersWithWritePermissions.indexOf(user1._id) > -1).ok;
                            should(cloud.membersWithWritePermissions.indexOf(user2._id) > -1).ok;
                            done();
                        });
                    });
                }
            });
        });
    });

    describe('Creating a cloud with invalid inputs', function () {
        var sampleUser = {
            name: {
                familyName: "Test Family Name",
                givenName: "testGivenName",
                middleName: "_*^%$£@!"
            },
            displayName: "user1",
            email: "testEmail1@email.com",
            password: "testPassword"
        };
        var sampleCloud = {
            name: "sampleCloud",
            description: "A sample cloud",
            icon: "some/icon.png"
        };
        var sampleCloudWithNoName = {
            description: "A sample cloud",
            icon: "some/icon.png"
        };

        it('should not save and give an error when name is not provided', function (done) {
            userLib.createUserLocalStrategy(sampleUser, function (err, user) {
                if (err) {
                    done(err);
                } else {
                    should.exist(user._id);
                    sampleCloudWithNoName.owner = user._id;
                    cloudLib.createCloud(sampleCloudWithNoName, function (err, cloud) {
                        should.not.exist(cloud);
                        should.exist(err);
                        done();
                    });
                }
            });

        });
        it('should not save and give and error when name is not unique', function (done) {
            userLib.createUserLocalStrategy(sampleUser, function (err, user) {
                if (err) {
                    done(err);
                } else {
                    should.exist(user._id);
                    sampleCloud.owner = user._id;
                    cloudLib.createCloud(sampleCloud, function (err, cloud) {
                        if (err) {
                            done(err);
                        }
                        cloud.name.should.equal(sampleCloud.name);
                        cloudLib.createCloud(sampleCloud, function (err, extraCloud) {
                            should.not.exist(extraCloud);
                            should.exist(err);
                            done();

                        });

                    });
                }
            });
        });
        it('should not save and give an error when owner is not provided', function (done) {
            sampleCloud.owner = null;
            cloudLib.createCloud(sampleCloud, function (err, cloud) {
                should.not.exist(cloud);
                should.exist(err);
                done();
            });
        });
    });
});