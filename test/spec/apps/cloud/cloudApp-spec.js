/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var specUtil = require('../../spec-util');
var cloudSpecUtil = require('./cloud-spec-util');

describe('Publishing, Updating and Removing Apps in Clouds', function () {
    var database;
    var cloudLib;

    before(function () {
        database = require(global.config.apps.DATABASE);
        cloudLib = require(global.config.apps.CLOUD);
    });

    beforeEach(function (done) {
        cloudSpecUtil.seedCloudsInDatabase(done);
    });

    afterEach(function (done) {
        specUtil.dropDatabase(database, done);
    });

    describe('Publishing App to User Cloud', function () {
        it('should update the app list with the new app if App Owner is Cloud Owner', function (done) {
            cloudLib.addAppToCloud(cloudSpecUtil.getCloud1Id(), cloudSpecUtil.getApp1Id(), function (err, cloud) {
                if (err) return done(err);
                should.exist(cloud);

                cloud._id.should.eql(cloudSpecUtil.getCloud1Id());
                cloud.owner.should.eql(cloudSpecUtil.getUser1Id());

                cloud.should.have.property('apps').with.lengthOf(1);
                cloud.apps[0].should.eql(cloudSpecUtil.getApp1Id());

                done();
            });
        });
        it('should update the app list with the new app if App Owner is not Cloud Owner but is in the writeable members list', function (done) {
            cloudLib.addCloudMemberWithWritePermissions(cloudSpecUtil.getCloud1Id(), cloudSpecUtil.getUser2Id(), function (err, cloud) {
                if (err) return done(err);
                should.exist(cloud);
                cloud._id.should.eql(cloudSpecUtil.getCloud1Id());
                cloud.owner.should.eql(cloudSpecUtil.getUser1Id());
                cloud.should.have.property('membersWithWritePermissions').with.lengthOf(1);
                cloud.membersWithWritePermissions[0].should.eql(cloudSpecUtil.getUser2Id());

                cloudLib.addAppToCloud(cloud._id, cloudSpecUtil.getApp2Id(), function (err, cloud) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(cloud);

                    cloud.should.have.property('apps').with.lengthOf(1);
                    cloud.apps[0].should.eql(cloudSpecUtil.getApp2Id());

                    done();
                });
            });
        });
        it('should Not update the app list with the new app if App Owner is Not Cloud Owner and Not in the writeable members list', function (done) {
            cloudLib.addAppToCloud(cloudSpecUtil.getCloud1Id(), cloudSpecUtil.getApp2Id(), function (err, cloud) {
                should.exist(err);
                if (cloud.apps) {
                    should(cloud.apps.indexOf(cloudSpecUtil) === -1).ok;
                }
                done();
            });
        });
        it('should not add an App to a Cloud if the App is already in the Cloud', function (done) {
            cloudLib.addAppToCloud(cloudSpecUtil.getCloud3Id(), cloudSpecUtil.getApp3Id(), function (err, cloud) {
                if (err) return done(err);
                should.exist(cloud);
                cloudLib.addAppToCloud(cloudSpecUtil.getCloud3Id(), cloudSpecUtil.getApp3Id(), function (err, cloud) {
                    should.exist(err);
                    should.exist(cloud);
                    cloud.apps.length.should.equal(1);
                    done();
                });
            });
        });
        it('should not add an App to a Cloud if the App is already in another Cloud that the App Owner has write permissions for', function (done) {
            cloudLib.addCloudMemberWithWritePermissions(cloudSpecUtil.getCloud4Id(), cloudSpecUtil.getUser3Id(), function (err, cloud) {
                if (err) return done(err);
                should.exist(cloud);
                cloudLib.addAppToCloud(cloudSpecUtil.getCloud3Id(), cloudSpecUtil.getApp3Id(), function (err, cloud) {
                    if (err) return done(err);
                    should.exist(cloud);
                    cloud.apps.length.should.equal(1);
                    cloudLib.addAppToCloud(cloudSpecUtil.getCloud4Id(), cloudSpecUtil.getApp3Id(), function (err, cloud) {
                        should.exist(err);
                        should.exist(cloud);
                        cloud.apps.length.should.equal(0);
                        done();
                    });
                });
            });
        });
    });

    describe('Removing Apps from Cloud', function () {
        it('should remove an App from Cloud', function (done) {
            cloudLib.addAppToCloud(cloudSpecUtil.getCloud1Id(), cloudSpecUtil.getApp1Id(), function (err, cloud) {
                if (err) return done(err);
                should.exist(cloud);

                cloud._id.should.eql(cloudSpecUtil.getCloud1Id());
                cloud.owner.should.eql(cloudSpecUtil.getUser1Id());

                cloud.should.have.property('apps').with.lengthOf(1);
                cloud.apps[0].should.eql(cloudSpecUtil.getApp1Id());

                cloudLib.removeAppFromCloud(cloudSpecUtil.getCloud1Id(), cloudSpecUtil.getApp1Id(), function (err, cloud) {
                    if (err) return done(err);
                    should.exist(cloud);
                    should(cloud.apps.indexOf(cloudSpecUtil.getApp1Id()) === -1).ok;
                    done();
                });
            });
        });
        it('should give an error if the App does not exist in the Cloud', function (done) {
            cloudLib.removeAppFromCloud(cloudSpecUtil.getCloud1Id(), cloudSpecUtil.getApp1Id(), function (err, cloud) {
                should.exist(err);
                should.exist(cloud);
                done();
            });
        });
    });

    describe('Cloud Apps retrieval', function () {
        it('should get all apps belonging to a cloud', function (done) {
            cloudLib.addAppToCloud(cloudSpecUtil.getCloud2Id(), cloudSpecUtil.getApp2Id(), function (err, cloud) {
                if (err) return done(err);
                should.exist(cloud);

                cloud._id.should.eql(cloudSpecUtil.getCloud2Id());
                cloud.owner.should.eql(cloudSpecUtil.getUser2Id());

                cloud.should.have.property('apps').with.lengthOf(1);
                cloud.apps[0].should.eql(cloudSpecUtil.getApp2Id());

                cloudLib.getCloudApps(cloudSpecUtil.getCloud2Id(), function (err, apps) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(apps);
                    apps.length.should.equal(1);
                    apps[0]._id.should.eql(cloudSpecUtil.getApp2Id());
                    apps[0].name.should.equal('app2');
                    done();
                });
            });
        });
        it('should get a list of app names belonging to a cloud', function (done) {
            cloudLib.addCloudMemberWithWritePermissions(cloudSpecUtil.getCloud4Id(), cloudSpecUtil.getUser2Id(), function (err, cloud) {
                if (err) return done(err);
                should.exist(cloud);
                cloudLib.addCloudMemberWithWritePermissions(cloudSpecUtil.getCloud4Id(), cloudSpecUtil.getUser3Id(), function (err, cloud) {
                    if (err) return done(err);
                    should.exist(cloud);
                    cloudLib.addAppToCloud(cloudSpecUtil.getCloud4Id(), cloudSpecUtil.getApp2Id(), function (err, cloud) {
                        if (err) return done(err);
                        should.exist(cloud);
                        cloudLib.addAppToCloud(cloudSpecUtil.getCloud4Id(), cloudSpecUtil.getApp3Id(), function (err, cloud) {
                            if (err) return done(err);
                            should.exist(cloud);
                            cloudLib.addAppToCloud(cloudSpecUtil.getCloud4Id(), cloudSpecUtil.getApp4Id(), function (err, cloud) {
                                if (err) return done(err);
                                should.exist(cloud);

                                cloudLib.getCloudAppNames(cloud._id, function (err, names) {
                                    if (err) return done(err);
                                    should.exist(names);
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