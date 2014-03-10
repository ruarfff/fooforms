/*jslint node: true */
'use strict';

var should = require('should');
var specUtil = require('../../spec-util');
var cloudSpecUtil = require('./cloud-spec-util');
var log = require(global.config.apps.LOGGING).LOG;

describe('Cloud Utility Functions', function () {
    var database;
    var cloudLib;

    before(function () {
        specUtil.init();
        database = require(global.config.apps.DATABASE);
        cloudLib = require(global.config.apps.CLOUD);
    });

    after(function () {
        specUtil.tearDown();
    });

    beforeEach(function (done) {
        specUtil.openDatabase(database, function (err) {
            if (err) {
                return done(err);
            }
            cloudSpecUtil.seedCloudsInDatabase(done);
        });
    });

    afterEach(function (done) {
        specUtil.dropDatabase(database, done);
    });

    describe('Checking if User has write permissions for Cloud', function () {
        it('should return true when user is cloud owner', function (done) {
            cloudLib.Cloud.findById(cloudSpecUtil.getCloud3Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);
                should(cloudLib.userHasWritePermissionInCloud(cloud, cloudSpecUtil.getUser3Id())).ok;
                done();
            });
        });
        it('should return true when user is in membersWithWritePermissions list', function (done) {
            cloudLib.Cloud.findById(cloudSpecUtil.getCloud1Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);
                cloud.membersWithWritePermissions = [cloudSpecUtil.getUser2Id()];
                should(cloudLib.userHasWritePermissionInCloud(cloud, cloudSpecUtil.getUser2Id())).ok;
                done();
            });
        });
        it('should return false when user is not in membersWithWritePermissions list and is not the Cloud Owner', function (done) {
            cloudLib.Cloud.findById(cloudSpecUtil.getCloud2Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);
                should(cloudLib.userHasWritePermissionInCloud(cloud, cloudSpecUtil.getUser4Id())).not.ok;
                done();
            });
        });
    });

    describe('Checking and creating Cloud member lists', function () {
        it('should do nothing when lists exist', function (done) {
            cloudLib.Cloud.findById(cloudSpecUtil.getCloud1Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);
                var membersArray = [cloudSpecUtil.getUser1Id(), cloudSpecUtil.getUser2Id(), cloudSpecUtil.getUser3Id(), cloudSpecUtil.getUser4Id()];
                var membersWithWritePermissionsArray = [cloudSpecUtil.getUser2Id()];
                cloud.members = membersArray;
                cloud.membersWithWritePermissions = membersWithWritePermissionsArray;
                cloudLib.checkAndCreateCloudMemberLists(cloud);
                cloud.members[0].should.equal(membersArray[0]);
                cloud.members[1].should.equal(membersArray[1]);
                cloud.members[2].should.equal(membersArray[2]);
                cloud.members[3].should.equal(membersArray[3]);
                cloud.membersWithWritePermissions[0].should.equal(membersWithWritePermissionsArray[0]);
                done();
            });
        });
        it('should create lists when they do not exist', function (done) {
            cloudLib.Cloud.findById(cloudSpecUtil.getCloud2Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);
                cloudLib.checkAndCreateCloudMemberLists(cloud);
                should.exist(cloud.members);
                should.exist(cloud.membersWithWritePermissions);
                done();
            });
        });
    });


});