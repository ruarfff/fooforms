/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var specUtil = require('../../spec-util');
var cloudSpecUtil = require('./cloud-spec-util');

var App = require(global.config.modules.APP).App;
var Cloud = require(global.config.modules.CLOUD).Cloud;

describe('Adding, updating and removing cloud members', function () {
    var cloudLib;
    var User;

    before(function () {
        cloudLib = require(global.config.modules.CLOUD);
        User = require(global.config.modules.USER).User;
    });

    beforeEach(function (done) {
        cloudSpecUtil.seedCloudsInDatabase(done);
    });

    afterEach(function (done) {
        specUtil.dropDatabase(done);
    });

    describe('Checking if user is already a cloud member', function () {
        it('should return true if user is cloud owner', function (done) {
            cloudLib.Cloud.findById(cloudSpecUtil.getCloud4Id(), function (err, cloud) {
                if (err) return done(err);
                should.exist(cloud);
                User.findById(cloudSpecUtil.getUser4Id(), function (err, user) {
                    if (err) return done(err);
                    should.exist(user);

                    should(cloudLib.userIsCloudMember(cloud, user)).ok;
                    done();
                });
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
                    User.findById(cloud.members[0], function (err, user) {
                        if (err) return done(err);
                        should.exist(user);

                        should(cloudLib.userIsCloudMember(cloud, user)).ok;
                        done();
                    });
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
                    User.findById(cloudSpecUtil.getUser1Id(), function (err, user) {
                        if (err) return done(err);
                        should.exist(user);

                        should(cloudLib.userIsCloudMember(cloud, user)).ok;
                        should(cloudLib.userHasWritePermissionInCloud(cloud, user)).ok;
                        done();
                    });
                });
            });

        });
        it('should return false when user is in members list but not in write permissions list', function (done) {
            cloudLib.Cloud.findById(cloudSpecUtil.getCloud3Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);
                cloudLib.addCloudMember(cloud._id, cloudSpecUtil.getUser1Id(), function (err, cloud) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(cloud);
                    should.exist(cloud.members[0]);
                    User.findById(cloud.members[0], function (err, user) {
                        if (err) return done(err);
                        should.exist(user);

                        should(cloudLib.userIsCloudMember(cloud, user)).ok;
                        should(cloudLib.userHasWritePermissionInCloud(cloud, user)).not.ok;
                        done();
                    });
                });
            });
        });
        it('should return false if user is not owner or in any members list', function (done) {
            cloudLib.Cloud.findById(cloudSpecUtil.getCloud2Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);

                User.findById(cloudSpecUtil.getUser1Id(), function (err, user) {
                    if (err) return done(err);
                    should.exist(user);

                    should(cloudLib.userIsCloudMember(cloud, user)).not.ok;
                    should(cloudLib.userHasWritePermissionInCloud(cloud, user)).not.ok;
                    done();
                });

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
                User.findById(cloudSpecUtil.getUser3Id(), function (err, user) {
                    if (err) return done(err);
                    should.exist(user);

                    should(cloudLib.userIsCloudMember(cloud, user)).ok;
                    should(cloudLib.userHasWritePermissionInCloud(cloud, user)).ok;
                    done();
                });
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
                User.findById(cloudSpecUtil.getUser3Id(), function (err, user) {
                    if (err) return done(err);
                    should.exist(user);

                    should(cloudLib.userIsCloudMember(cloud, user)).ok;
                    done();
                });
            });
        });
        it('should add a member to a cloud with write permissions', function (done) {
            cloudLib.addCloudMemberWithWritePermissions(cloudSpecUtil.getCloud2Id(), cloudSpecUtil.getUser3Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);
                User.findById(cloudSpecUtil.getUser3Id(), function (err, user) {
                    if (err) return done(err);
                    should.exist(user);

                    should(cloudLib.userIsCloudMember(cloud, user)).ok;
                    should(cloudLib.userHasWritePermissionInCloud(cloud, user)).ok;
                    done();
                });
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
                User.findById(cloudSpecUtil.getUser3Id(), function (err, user) {
                    if (err) return done(err);
                    should.exist(user);

                    should(cloudLib.userIsCloudMember(cloud, user)).ok;
                    cloudLib.addCloudMember(cloud._id, user._id, function (err) {
                        should.exist(err);
                        done();
                    });
                });
            });
        });
        it('should give an error if the user already has write permissions', function (done) {
            cloudLib.addCloudMemberWithWritePermissions(cloudSpecUtil.getCloud1Id(), cloudSpecUtil.getUser3Id(), function (err, cloud) {
                if (err) return done(err);
                should.exist(cloud);
                User.findById(cloudSpecUtil.getUser3Id(), function (err, user) {
                    if (err) return done(err);
                    should.exist(user);

                    should(cloudLib.userHasWritePermissionInCloud(cloud, user)).ok;
                    cloudLib.addCloudMember(cloud._id, user._id, function (err) {
                        should.exist(err);
                        done();
                    });
                });
            });
        });
    });

    describe('Updating an existing members permissions in a cloud', function () {
        it('should give an existing standard user write permissions', function (done) {
            cloudLib.addCloudMember(cloudSpecUtil.getCloud2Id(), cloudSpecUtil.getUser3Id(), function (err, cloud) {
                if (err) return done(err);
                should.exist(cloud);
                User.findById(cloudSpecUtil.getUser3Id(), function (err, user) {
                    if (err) return done(err);
                    should.exist(user);

                    should(cloudLib.userIsCloudMember(cloud, user)).ok;
                    cloudLib.addCloudMemberWithWritePermissions(cloud._id, user._id, function (err, cloud) {
                        if (err) return done(err);
                        should.exist(cloud);
                        User.findById(cloudSpecUtil.getUser3Id(), function (err, user) {
                            if (err) return done(err);
                            should.exist(user);
                            should(cloudLib.userHasWritePermissionInCloud(cloud, user)).ok;
                            done();
                        });
                    });
                });
            });
        });
        it('should remove a users write permissions', function (done) {
            cloudLib.addCloudMemberWithWritePermissions(cloudSpecUtil.getCloud4Id(), cloudSpecUtil.getUser1Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);
                User.findById(cloudSpecUtil.getUser1Id(), function (err, user) {
                    if (err) return done(err);
                    should.exist(user);
                    should(cloudLib.userHasWritePermissionInCloud(cloud, user)).ok;
                    cloudLib.removeCloudMemberWritePermissions(cloud._id, user._id, function (err, cloud) {
                        if (err) return done(err);
                        should.exist(cloud);
                        User.findById(user._id, function (err, user) {
                            if (err) return done(err);
                            should.exist(user);
                            should(cloudLib.userHasWritePermissionInCloud(cloud, user)).not.ok;
                            done();
                        });
                    });
                });
            });
        });
    });

    describe('Removing a cloud member', function () {
        it('should give an error if the user to be deleted is the cloud owner', function (done) {
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
                User.findById(cloudSpecUtil.getUser4Id(), function (err, user) {
                    if (err) return done(err);
                    should.exist(user);
                    should(cloudLib.userIsCloudMember(cloud, user)).ok;
                    cloudLib.removeCloudMember(cloud._id, user._id, function (err, cloud) {
                        if (err) return done(err);
                        should.exist(cloud);
                        User.findById(user._id, function (err, user) {
                            if (err) return done(err);
                            should.exist(user);
                            should(cloudLib.userIsCloudMember(cloud, user)).not.ok;
                            done();
                        });
                    });
                });
            });
        });
        it('should remove a user with write permissions from all member lists', function (done) {
            cloudLib.addCloudMemberWithWritePermissions(cloudSpecUtil.getCloud2Id(), cloudSpecUtil.getUser4Id(), function (err, cloud) {
                if (err) return done(err);
                should.exist(cloud);
                User.findById(cloudSpecUtil.getUser4Id(), function (err, user) {
                    if (err) return done(err);
                    should.exist(user);
                    should(cloudLib.userIsCloudMember(cloud, user)).ok;
                    should(cloudLib.userHasWritePermissionInCloud(cloud, user)).ok;
                    cloudLib.removeCloudMember(cloud._id, user._id, function (err, cloud) {
                        if (err) return done(err);
                        should.exist(cloud);
                        User.findById(user._id, function (err, user) {
                            if (err) return done(err);
                            should.exist(user);
                            should(cloudLib.userIsCloudMember(cloud, user)).not.ok;
                            should(cloudLib.userHasWritePermissionInCloud(cloud, user)).not.ok;
                            done();
                        });
                    });
                });
            });
        });
    });

    describe('Cloud Member retrieval', function () {
        it('should get a list of cloud members', function (done) {
            cloudLib.addCloudMember(cloudSpecUtil.getCloud2Id(), cloudSpecUtil.getUser4Id(), function (err, cloud) {
                if (err) return done(err);
                should.exist(cloud);
                cloudLib.getCloudMembers(cloud._id, function (err, users) {
                    if (err) return done(err);
                    should.exist(users);
                    users.length.should.equal(1);
                    users[0]._id.should.eql(cloudSpecUtil.getUser4Id());
                    users[0].displayName.should.equal('user4');
                    users[0].email.should.equal('testEmail4@email.com');
                    done();
                });
            });
        });
        it('should get a list of all members with write permissions', function (done) {
            cloudLib.addCloudMemberWithWritePermissions(cloudSpecUtil.getCloud4Id(), cloudSpecUtil.getUser1Id(), function (err, cloud) {
                if (err) return done(err);
                should.exist(cloud);
                cloudLib.addCloudMemberWithWritePermissions(cloudSpecUtil.getCloud4Id(), cloudSpecUtil.getUser3Id(), function (err, cloud) {
                    if (err) return done(err);
                    should.exist(cloud);
                    cloudLib.getCloudMembersWithWritePermissions(cloud._id, function (err, users) {
                        if (err) return done(err);
                        should.exist(users);
                        users.length.should.equal(2);
                        done();
                    })
                });
            });
        });
    });

});