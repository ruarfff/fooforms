/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var specUtil = require('../spec-util');
var folderSpecUtil = require('./folder-spec-util');

var Folder = require(global.config.modules.FOLDER).Folder;

describe('Adding, updating and removing folder members', function () {
    var folderLib;
    var User;

    before(function () {
        folderLib = require(global.config.modules.FOLDER);
        User = require(global.config.modules.USER).User;
    });

    beforeEach(function (done) {
        folderSpecUtil.seedFoldersInDatabase(done);
    });

    afterEach(function () {
        specUtil.dropDatabase();
    });

    describe('Checking if user is already a folder member', function () {
        it('should return true if user is folder owner', function (done) {
            folderLib.Folder.findById(folderSpecUtil.getFolder4Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);
                User.findById(folderSpecUtil.getUser4Id(), function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(user);

                    should(folderLib.userIsFolderMember(folder, user)).ok;
                    done();
                });
            });
        });
        it('should return true if user is in the members list', function (done) {
            folderLib.Folder.findById(folderSpecUtil.getFolder3Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);
                folderLib.addFolderMember(folder._id, folderSpecUtil.getUser4Id(), function (err, folder) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(folder);
                    should.exist(folder.members[0]);
                    User.findById(folder.members[0], function (err, user) {
                        if (err) return done(err);
                        should.exist(user);

                        should(folderLib.userIsFolderMember(folder, user)).ok;
                        done();
                    });
                });
            });

        });
        it('should return true is user is in the write permissions list', function (done) {
            folderLib.Folder.findById(folderSpecUtil.getFolder2Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);
                folderLib.addFolderMemberWithWritePermissions(folder._id, folderSpecUtil.getUser1Id(), function (err, folder) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(folder);
                    User.findById(folderSpecUtil.getUser1Id(), function (err, user) {
                        if (err) return done(err);
                        should.exist(user);

                        should(folderLib.userIsFolderMember(folder, user)).ok;
                        should(folderLib.userHasWritePermissionInFolder(folder, user)).ok;
                        done();
                    });
                });
            });

        });
        it('should return false when user is in members list but not in write permissions list', function (done) {
            folderLib.Folder.findById(folderSpecUtil.getFolder3Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);
                folderLib.addFolderMember(folder._id, folderSpecUtil.getUser1Id(), function (err, folder) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(folder);
                    should.exist(folder.members[0]);
                    User.findById(folder.members[0], function (err, user) {
                        if (err) return done(err);
                        should.exist(user);

                        should(folderLib.userIsFolderMember(folder, user)).ok;
                        should(folderLib.userHasWritePermissionInFolder(folder, user)).not.ok;
                        done();
                    });
                });
            });
        });
        it('should return false if user is not owner or in any members list', function (done) {
            folderLib.Folder.findById(folderSpecUtil.getFolder2Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);

                User.findById(folderSpecUtil.getUser1Id(), function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(user);

                    should(folderLib.userIsFolderMember(folder, user)).not.ok;
                    should(folderLib.userHasWritePermissionInFolder(folder, user)).not.ok;
                    done();
                });

            });
        });
    });

    describe('Checking if User has write permissions for Folder', function () {
        it('should return true when user is folder owner', function (done) {
            folderLib.Folder.findById(folderSpecUtil.getFolder3Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);
                User.findById(folderSpecUtil.getUser3Id(), function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(user);

                    should(folderLib.userIsFolderMember(folder, user)).ok;
                    should(folderLib.userHasWritePermissionInFolder(folder, user)).ok;
                    done();
                });
            });
        });
    });

    describe('Checking and creating Folder member lists', function () {
        it('should do nothing when lists exist', function (done) {
            folderLib.Folder.findById(folderSpecUtil.getFolder1Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);
                var membersArray = [folderSpecUtil.getUser1Id(), folderSpecUtil.getUser2Id(), folderSpecUtil.getUser3Id(), folderSpecUtil.getUser4Id()];
                var membersWithWritePermissionsArray = [folderSpecUtil.getUser2Id()];
                folder.members = membersArray;
                folder.membersWithWritePermissions = membersWithWritePermissionsArray;
                folderLib.checkAndCreateFolderMemberLists(folder);
                folder.members[0].should.equal(membersArray[0]);
                folder.members[1].should.equal(membersArray[1]);
                folder.members[2].should.equal(membersArray[2]);
                folder.members[3].should.equal(membersArray[3]);
                folder.membersWithWritePermissions[0].should.equal(membersWithWritePermissionsArray[0]);
                done();
            });
        });
        it('should create lists when they do not exist', function (done) {
            folderLib.Folder.findById(folderSpecUtil.getFolder2Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);
                folderLib.checkAndCreateFolderMemberLists(folder);
                should.exist(folder.members);
                should.exist(folder.membersWithWritePermissions);
                done();
            });
        });
    });

    describe('Adding a member to a folder', function () {
        it('should add a user to a folder', function (done) {
            folderLib.addFolderMember(folderSpecUtil.getFolder2Id(), folderSpecUtil.getUser3Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);
                User.findById(folderSpecUtil.getUser3Id(), function (err, user) {
                    if (err) return done(err);
                    should.exist(user);

                    should(folderLib.userIsFolderMember(folder, user)).ok;
                    done();
                });
            });
        });
        it('should add a member to a folder with write permissions', function (done) {
            folderLib.addFolderMemberWithWritePermissions(folderSpecUtil.getFolder2Id(), folderSpecUtil.getUser3Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);
                User.findById(folderSpecUtil.getUser3Id(), function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(user);

                    should(folderLib.userIsFolderMember(folder, user)).ok;
                    should(folderLib.userHasWritePermissionInFolder(folder, user)).ok;
                    done();
                });
            });
        });
        it('should give an error if the user to be added is the folder owner', function (done) {
            folderLib.addFolderMember(folderSpecUtil.getFolder2Id(), folderSpecUtil.getUser2Id(), function (err) {
                should.exist(err);
                done();
            });
        });
        it('should give an error if the user to be given write permissions is the folder owner', function (done) {
            folderLib.addFolderMemberWithWritePermissions(folderSpecUtil.getFolder1Id(), folderSpecUtil.getUser1Id(), function (err) {
                should.exist(err);
                done();
            });
        });
        it('should give an error if the user already exists as a normal member', function (done) {
            folderLib.addFolderMember(folderSpecUtil.getFolder2Id(), folderSpecUtil.getUser3Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);
                User.findById(folderSpecUtil.getUser3Id(), function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(user);

                    should(folderLib.userIsFolderMember(folder, user)).ok;
                    folderLib.addFolderMember(folder._id, user._id, function (err) {
                        should.exist(err);
                        done();
                    });
                });
            });
        });
        it('should give an error if the user already has write permissions', function (done) {
            folderLib.addFolderMemberWithWritePermissions(folderSpecUtil.getFolder1Id(), folderSpecUtil.getUser3Id(), function (err, folder) {
                if (err) return done(err);
                should.exist(folder);
                User.findById(folderSpecUtil.getUser3Id(), function (err, user) {
                    if (err) return done(err);
                    should.exist(user);

                    should(folderLib.userHasWritePermissionInFolder(folder, user)).ok;
                    folderLib.addFolderMember(folder._id, user._id, function (err) {
                        should.exist(err);
                        done();
                    });
                });
            });
        });
    });

    describe('Updating an existing members permissions in a folder', function () {
        it('should give an existing standard user write permissions', function (done) {
            folderLib.addFolderMember(folderSpecUtil.getFolder2Id(), folderSpecUtil.getUser3Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);
                User.findById(folderSpecUtil.getUser3Id(), function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(user);

                    should(folderLib.userIsFolderMember(folder, user)).ok;
                    folderLib.addFolderMemberWithWritePermissions(folder._id, user._id, function (err, folder) {
                        if (err) {
                            return done(err);
                        }
                        should.exist(folder);
                        User.findById(folderSpecUtil.getUser3Id(), function (err, user) {
                            if (err) return done(err);
                            should.exist(user);
                            should(folderLib.userHasWritePermissionInFolder(folder, user)).ok;
                            done();
                        });
                    });
                });
            });
        });
        it('should remove a users write permissions', function (done) {
            folderLib.addFolderMemberWithWritePermissions(folderSpecUtil.getFolder4Id(), folderSpecUtil.getUser1Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);
                User.findById(folderSpecUtil.getUser1Id(), function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(user);
                    should(folderLib.userHasWritePermissionInFolder(folder, user)).ok;
                    folderLib.removeFolderMemberWritePermissions(folder._id, user._id, function (err, folder) {
                        if (err) {
                            return done(err);
                        }
                        should.exist(folder);
                        User.findById(user._id, function (err, user) {
                            if (err) {
                                return done(err);
                            }
                            should.exist(user);
                            should(folderLib.userHasWritePermissionInFolder(folder, user)).not.ok;
                            done();
                        });
                    });
                });
            });
        });
    });

    describe('Removing a folder member', function () {
        it('should give an error if the user to be deleted is the folder owner', function (done) {
            folderLib.removeFolderMember(folderSpecUtil.getFolder2Id(), folderSpecUtil.getUser2Id(), function (err) {
                should.exist(err);
                done();
            });
        });
        it('should remove a standard user from the members list', function (done) {
            folderLib.addFolderMember(folderSpecUtil.getFolder2Id(), folderSpecUtil.getUser4Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);
                User.findById(folderSpecUtil.getUser4Id(), function (err, user) {
                    if (err) return done(err);
                    should.exist(user);
                    should(folderLib.userIsFolderMember(folder, user)).ok;
                    folderLib.removeFolderMember(folder._id, user._id, function (err, folder) {
                        if (err) return done(err);
                        should.exist(folder);
                        User.findById(user._id, function (err, user) {
                            if (err) return done(err);
                            should.exist(user);
                            should(folderLib.userIsFolderMember(folder, user)).not.ok;
                            done();
                        });
                    });
                });
            });
        });
        it('should remove a user with write permissions from all member lists', function (done) {
            folderLib.addFolderMemberWithWritePermissions(folderSpecUtil.getFolder2Id(), folderSpecUtil.getUser4Id(), function (err, folder) {
                if (err) return done(err);
                should.exist(folder);
                User.findById(folderSpecUtil.getUser4Id(), function (err, user) {
                    if (err) return done(err);
                    should.exist(user);
                    should(folderLib.userIsFolderMember(folder, user)).ok;
                    should(folderLib.userHasWritePermissionInFolder(folder, user)).ok;
                    folderLib.removeFolderMember(folder._id, user._id, function (err, folder) {
                        if (err) return done(err);
                        should.exist(folder);
                        User.findById(user._id, function (err, user) {
                            if (err) return done(err);
                            should.exist(user);
                            should(folderLib.userIsFolderMember(folder, user)).not.ok;
                            should(folderLib.userHasWritePermissionInFolder(folder, user)).not.ok;
                            done();
                        });
                    });
                });
            });
        });
    });

    describe('Folder Member retrieval', function () {
        it('should get a list of folder members', function (done) {
            folderLib.addFolderMember(folderSpecUtil.getFolder2Id(), folderSpecUtil.getUser4Id(), function (err, folder) {
                if (err) return done(err);
                should.exist(folder);
                folderLib.getFolderMembers(folder._id, function (err, users) {
                    if (err) return done(err);
                    should.exist(users);
                    users.length.should.equal(1);
                    users[0]._id.should.eql(folderSpecUtil.getUser4Id());
                    users[0].displayName.should.equal('user4');
                    users[0].email.should.equal('testEmail4@email.com');
                    done();
                });
            });
        });
        it('should get a list of all members with write permissions', function (done) {
            folderLib.addFolderMemberWithWritePermissions(folderSpecUtil.getFolder4Id(), folderSpecUtil.getUser1Id(), function (err, folder) {
                if (err) return done(err);
                should.exist(folder);
                folderLib.addFolderMemberWithWritePermissions(folderSpecUtil.getFolder4Id(), folderSpecUtil.getUser3Id(), function (err, folder) {
                    if (err) return done(err);
                    should.exist(folder);
                    folderLib.getFolderMembersWithWritePermissions(folder._id, function (err, users) {
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