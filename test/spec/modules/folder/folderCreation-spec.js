/*jslint node: true */
/* global describe, afterEach, before, it, beforeEach */
'use strict';

var path = require('path');
var should = require('should');
var testUtil = require('../spec-util');
var folderSpecUtil = require('./folder-spec-util');
var log = require(global.config.modules.LOGGING).LOG;

var User = require(global.config.modules.USER).User;
var Folder = require(global.config.modules.FOLDER).Folder;

describe('Folder creation', function () {
    var folderLib;
    var userLib;

    before(function () {
        folderLib = require(global.config.modules.FOLDER);
        userLib = require(global.config.modules.USER);
    });


    afterEach(function () {
        testUtil.dropDatabase();
    });

    describe('Creating a folder with valid inputs', function () {

        var sampleUser = {};
        var sampleFolder = {};

        beforeEach(function () {
            sampleUser = {
                name: {
                    familyName: "Test Family Name",
                    givenName: "testGivenName",
                    middleName: "_*^%$£@!"
                },
                displayName: "sample-user",
                email: "testEmail1@email.com",
                password: "testPassword"
            };
            sampleFolder = {
                name: "sampleFolder",
                description: "A sample folder",
                icon: "some/icon.png"
            };
        });


        it('should create a Folder', function (done) {

            userLib.createUser(sampleUser, function (err, user) {
                if (err) {
                    done(err);
                } else {
                    should.exist(user._id);
                    sampleFolder.owner = user._id;
                    folderLib.createFolder(sampleFolder, function (err, folder) {
                        if (err) {
                            done(err);
                        }
                        folder.name.should.equal(sampleFolder.name);
                        folder.description.should.equal(sampleFolder.description);
                        folder.icon.should.equal(sampleFolder.icon);
                        folder.owner.should.equal(user._id);
                        done();
                    });
                }
            });

        });
        it('should save Folder with members', function (done) {
            userLib.createUser(sampleUser, function (err, user) {
                if (err) {
                    done(err);
                } else {
                    should.exist(user._id);
                    User.create(folderSpecUtil.sampleUsersJSONArray, function (err, user1, user2, user3, user4) {
                        if (err) {
                            done(err);
                        }
                        should.exist(user1._id);
                        should.exist(user2._id);
                        should.exist(user3._id);
                        should.exist(user4._id);
                        sampleFolder.owner = user._id;
                        var numberOfMembers = 4;
                        sampleFolder.members = [user1._id, user2._id, user3._id, user4._id];
                        folderLib.createFolder(sampleFolder, function (err, folder) {
                            if (err) {
                                done(err);
                            }
                            folder.name.should.equal(sampleFolder.name);
                            folder.description.should.equal(sampleFolder.description);
                            folder.icon.should.equal(sampleFolder.icon);
                            folder.owner.should.equal(user._id);
                            folder.should.have.property('members').with.lengthOf(numberOfMembers);
                            should(folder.members.indexOf(user1._id) > -1).ok;
                            should(folder.members.indexOf(user2._id) > -1).ok;
                            should(folder.members.indexOf(user3._id) > -1).ok;
                            should(folder.members.indexOf(user4._id) > -1).ok;
                            done();
                        });
                    });
                }
            });

        });
        it('should create Folder with members that have write permissions', function (done) {
            userLib.createUser(sampleUser, function (err, user) {
                if (err) {
                    done(err);
                } else {
                    should.exist(user._id);
                    User.create(folderSpecUtil.sampleUsersJSONArray, function (err, user1, user2, user3, user4) {
                        if (err) {
                            done(err);
                        }
                        should.exist(user1._id);
                        should.exist(user2._id);
                        should.exist(user3._id);
                        should.exist(user4._id);
                        sampleFolder.owner = user._id;
                        var numberOfMembersWithWritePermissions = 2;
                        sampleFolder.members = [user1._id, user2._id, user3._id, user4._id];
                        sampleFolder.membersWithWritePermissions = [user1._id, user2._id];
                        folderLib.createFolder(sampleFolder, function (err, folder) {
                            if (err) {
                                done(err);
                            }
                            folder.name.should.equal(sampleFolder.name);
                            folder.description.should.equal(sampleFolder.description);
                            folder.icon.should.equal(sampleFolder.icon);
                            folder.owner.should.equal(user._id);
                            folder.should.have.property('membersWithWritePermissions').with.lengthOf(numberOfMembersWithWritePermissions);
                            should(folder.membersWithWritePermissions.indexOf(user1._id) > -1).ok;
                            should(folder.membersWithWritePermissions.indexOf(user2._id) > -1).ok;
                            done();
                        });
                    });
                }
            });
        });
    });

    describe('Creating a folder with invalid inputs', function () {
        var sampleUser = {};
        var sampleBaseFolder = {};
        var sampleFolder = {};
        var sampleFolderWithNoName = {};

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
            sampleBaseFolder = {
                name: "sampleFolder",
                icon: "some/icon.png"
            };
            sampleFolder = {
                name: "sampleFolder",
                description: "A sample folder",
                icon: "some/icon.png"
            };
            sampleFolderWithNoName = {
                description: "A sample folder",
                icon: "some/icon.png"
            };

        });


        it('should not save and give an error when name is not provided', function (done) {
            userLib.createUser(sampleUser, function (err, user) {
                if (err) {
                    done(err);
                } else {
                    should.exist(user._id);
                    sampleFolderWithNoName.owner = user._id;
                    folderLib.createFolder(sampleFolderWithNoName, function (err, folder) {
                        should.not.exist(folder);
                        should.exist(err);
                        done();
                    });
                }
            });

        });
        it.skip('should not save and give and error when name is not unique to user', function (done) {
            userLib.createUser(sampleUser, function (err, user) {
                if (err) {
                    done(err);
                } else {
                    should.exist(user._id);
                    sampleFolder.owner = user._id;
                    folderLib.createFolder(sampleFolder, function (err, folder) {
                        if (err) {
                            done(err);
                        }
                        folder.name.should.equal(sampleFolder.name);
                        folderLib.createFolder(sampleFolder, function (err, extraFolder) {
                            should.not.exist(extraFolder);
                            should.exist(err);
                            done();

                        });

                    });
                }
            });
        });
        it('should not save and give an error when owner is not provided', function (done) {
            sampleFolder.owner = null;
            folderLib.createFolder(sampleFolder, function (err, folder) {
                should.not.exist(folder);
                should.exist(err);
                done();
            });
        });
    });
});