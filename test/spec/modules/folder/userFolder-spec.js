/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var testUtil = require('../../spec-util');
var log = require(global.config.modules.LOGGING).LOG;

var User = require(global.config.modules.USER).User;
var Folder = require(global.config.modules.FOLDER).Folder;

var defaultUserFolderName = 'MyPrivateFolder';
var defaultSharedFolderName = 'MySharedFolder';

describe('Folder creation', function () {
    var folderLib;
    var userLib;

    var sampleUser = {};
    var sampleUserAsMember = {};

    before(function () {
        folderLib = require(global.config.modules.FOLDER);
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

    describe('Creating a User folder', function () {
        it('should create a User Folder', function (done) {
            userLib.createUser(sampleUser, function (err, user) {
                if (err) {
                    return done(err);
                }
                should.exist(user);
                folderLib.getFolderById(user.folder, function (err, folder) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(folder);
                    folder.name.should.equal(defaultUserFolderName);
                    folder.owner.should.eql(user._id);
                    folder.menuLabel.should.equal(user.displayName);
                    should(folder.isPrivate).ok;
                    should(folder.isUserFolder).ok;
                    should(folder.members.length === 0).ok;
                    should(folder.membersWithWritePermissions.length === 0).ok;
                    done();
                });
            });
        });
    });

    describe('Updating a User Folder', function () {

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
                    folderLib.getFolderById(user.folder, function (err, folder) {
                        if (err) {
                            return done(err);
                        }
                        should(folder.isUserFolder).ok;
                        folder.owner.should.eql(user._id);
                        should(folder.members.length === 0).ok;
                        should(folder.membersWithWritePermissions.length === 0).ok;

                        folderLib.addFolderMember(folder._id, member._id, function (err, folder) {
                            should.exist(err);
                            should.exist(folder);
                            should(folder.members.length === 0).ok;
                            should(folder.membersWithWritePermissions.length === 0).ok;
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
                    folderLib.getFolderById(user.folder, function (err, folder) {
                        if (err) {
                            return done(err);
                        }
                        should(folder.isUserFolder).ok;
                        folder.owner.should.eql(user._id);
                        should(folder.members.length === 0).ok;
                        should(folder.membersWithWritePermissions.length === 0).ok;

                        folderLib.addFolderMemberWithWritePermissions(folder._id, member._id, function (err, folder) {
                            should.exist(err);
                            should.exist(folder);
                            should(folder.members.length === 0).ok;
                            should(folder.membersWithWritePermissions.length === 0).ok;
                            done();
                        });
                    });

                });
            });
        });
    });
});