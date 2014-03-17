/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var specUtil = require('../../spec-util');
var cloudSpecUtil = require('./cloud-spec-util');

describe('Adding, updating and removing cloud members', function () {
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

    describe('Checking if user is already a cloud member', function () {
        it('should return true if user is cloud owner', function (done) {
            cloudLib.Cloud.findById(cloudSpecUtil.getCloud4Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);
                should(cloudLib.userIsCloudMember(cloud, cloudSpecUtil.getUser4Id())).ok;
                done();
            });
        });
        it('should return true if user is in the members list', function (done) {
            cloudLib.Cloud.findById(cloudSpecUtil.getCloud3Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);
                cloudLib.addCloudMember(cloud._id, cloudSpecUtil.getUser4Id(), function (err, cloud) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(cloud);
                    should.exist(cloud.members[0]);
                    should(cloudLib.userIsCloudMember(cloud, cloud.members[0])).ok;
                    done();
                });
            });

        });
        it('should return true is user is in the write permissions list', function (done) {
            cloudLib.Cloud.findById(cloudSpecUtil.getCloud2Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);
                cloudLib.addCloudMemberWithWritePermissions(cloud._id, cloudSpecUtil.getUser1Id(), function (err, cloud) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(cloud);
                    should(cloudLib.userIsCloudMember(cloud, cloudSpecUtil.getUser1Id())).ok;
                    should(cloudLib.userHasWritePermissionInCloud(cloud, cloudSpecUtil.getUser1Id())).ok;
                    done();
                });
            });

        });
        it('should return false if user is not owner or in any members list', function (done) {
            cloudLib.Cloud.findById(cloudSpecUtil.getCloud2Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);

                should(cloudLib.userIsCloudMember(cloud, cloudSpecUtil.getUser1Id())).not.ok;
                should(cloudLib.userHasWritePermissionInCloud(cloud, cloudSpecUtil.getUser1Id())).not.ok;
                done();

            });
        });
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

    describe('Adding a member to a cloud', function () {
        it('should add a user to a cloud', function (done) {
            cloudLib.addCloudMember(cloudSpecUtil.getCloud2Id(), cloudSpecUtil.getUser3Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);
                should(cloudLib.userIsCloudMember(cloud, cloudSpecUtil.getUser3Id())).ok;
                done();
            });
        });
        it('should add a member to a cloud with write permissions', function (done) {
            cloudLib.addCloudMemberWithWritePermissions(cloudSpecUtil.getCloud2Id(), cloudSpecUtil.getUser3Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);
                should(cloudLib.userHasWritePermissionInCloud(cloud, cloudSpecUtil.getUser3Id())).ok;
                done();
            });
        });
        it('should give an error if the user to be added is the cloud owner', function (done) {
            cloudLib.addCloudMember(cloudSpecUtil.getCloud2Id(), cloudSpecUtil.getUser2Id(), function (err) {
                should.exist(err);
                done();
            });
        });
        it('should give an error if the user to be given write permissions is the cloud owner', function (done) {
            cloudLib.addCloudMemberWithWritePermissions(cloudSpecUtil.getCloud1Id(), cloudSpecUtil.getUser1Id(), function (err) {
                should.exist(err);
                done();
            });
        });
        it('should give an error if the user already exists as a normal member', function (done) {
            cloudLib.addCloudMember(cloudSpecUtil.getCloud2Id(), cloudSpecUtil.getUser3Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);
                should(cloudLib.userIsCloudMember(cloud, cloudSpecUtil.getUser3Id())).ok;
                cloudLib.addCloudMember(cloudSpecUtil.getCloud2Id(), cloudSpecUtil.getUser3Id(), function (err) {
                    should.exist(err);
                    done();
                });
            });
        });
        it('should give an error if the user already has write permissions', function (done) {
            cloudLib.addCloudMemberWithWritePermissions(cloudSpecUtil.getCloud1Id(), cloudSpecUtil.getUser3Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);
                should(cloudLib.userHasWritePermissionInCloud(cloud, cloudSpecUtil.getUser3Id())).ok;
                cloudLib.addCloudMember(cloudSpecUtil.getCloud1Id(), cloudSpecUtil.getUser3Id(), function (err) {
                    should.exist(err);
                    done();
                });
            });
        });
    });

    describe('Updating an existing members permissions in a cloud', function () {
        it('should give an existing standard user write permissions', function (done) {
            cloudLib.addCloudMember(cloudSpecUtil.getCloud2Id(), cloudSpecUtil.getUser3Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);
                should(cloudLib.userIsCloudMember(cloud, cloudSpecUtil.getUser3Id())).ok;
                cloudLib.addCloudMemberWithWritePermissions(cloudSpecUtil.getCloud2Id(), cloudSpecUtil.getUser3Id(), function (err, cloud) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(cloud);
                    should(cloudLib.userHasWritePermissionInCloud(cloud, cloudSpecUtil.getUser3Id())).ok;
                    done();
                });
            });
        });
        it('should remove a users write permissions', function (done) {
            cloudLib.addCloudMemberWithWritePermissions(cloudSpecUtil.getCloud4Id(), cloudSpecUtil.getUser1Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);
                should(cloudLib.userHasWritePermissionInCloud(cloud, cloudSpecUtil.getUser1Id())).ok;
                cloudLib.removeCloudMemberWritePermissions(cloud._id, cloudSpecUtil.getUser1Id(), function (err, cloud) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(cloud);
                    should(cloudLib.userHasWritePermissionInCloud(cloud, cloudSpecUtil.getUser1Id())).not.ok;
                    done();
                });
            });
        });
    });

    describe('Removing a cloud member', function () {
        it('should give and error if the user to be deleted is the cloud owner', function (done) {
            cloudLib.removeCloudMember(cloudSpecUtil.getCloud2Id(), cloudSpecUtil.getUser2Id(), function (err) {
                should.exist(err);
                done();
            });
        });
        it('should remove a standard user from the members list', function (done) {
            cloudLib.addCloudMember(cloudSpecUtil.getCloud2Id(), cloudSpecUtil.getUser4Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);
                should(cloudLib.userIsCloudMember(cloud, cloudSpecUtil.getUser4Id())).ok;
                cloudLib.removeCloudMember(cloudSpecUtil.getCloud2Id(), cloudSpecUtil.getUser4Id(), function (err, cloud) {
                    if (err) {
                        return done(err);
                    }
                    should(cloudLib.userIsCloudMember(cloud, cloudSpecUtil.getUser4Id())).not.ok;
                    done();
                });
            });
        });
        it('should remove a user with write permissions from all member lists', function (done) {
            cloudLib.addCloudMemberWithWritePermissions(cloudSpecUtil.getCloud2Id(), cloudSpecUtil.getUser4Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);
                should(cloudLib.userIsCloudMember(cloud, cloudSpecUtil.getUser4Id())).ok;
                cloudLib.removeCloudMember(cloudSpecUtil.getCloud2Id(), cloudSpecUtil.getUser4Id(), function (err, cloud) {
                    if (err) {
                        return done(err);
                    }
                    should(cloudLib.userIsCloudMember(cloud, cloudSpecUtil.getUser4Id())).not.ok;
                    done();
                });
            });
        });
    });

    describe('Cloud Member retrieval', function () {
        it('should get a list of cloud members');
        it('should get a list of all members with write permissions');
    });

});