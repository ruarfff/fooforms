/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';
var path = require('path');
var should = require('should');
var specUtil = require('../spec-util');
var userSpecUtil = require('./user-spec-util');

var defaultUserFolderName = 'MyPrivateFolder';
var defaultSharedFolderName = 'MySharedFolder';

describe('User creation', function () {
    var userLib;
    var folderLib;

    before(function () {
        userLib = require(global.config.modules.USER);
        folderLib = require(global.config.modules.FOLDER);
    });

    afterEach(function (done) {
        specUtil.dropDatabase(done);
    });

    describe('Creating a user with valid inputs', function () {
        it('should create a User', function (done) {
            var testUser = userSpecUtil.getMockValidUser();
            userLib.createUser(testUser, function (err, user) {
                if (err) return done(err);
                    should.exist(user);
                    user.name.familyName.should.equal(testUser.name.familyName);
                    user.name.givenName.should.equal(testUser.name.givenName);
                    user.name.middleName.should.equal(testUser.name.middleName);
                    user.displayName.should.equal(testUser.displayName.toLowerCase());
                    user.password.should.not.equal(testUser.password); // Password get encrypted
                    user.provider.should.equal('local');
                    user.admin.should.equal(false);
                    done();
            });
        });

        it('should create a User Folder', function (done) {
            var testUser = userSpecUtil.getMockValidUser();
            userLib.createUser(testUser, function (err, user) {
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
                    done();
                });
            });
        });

        it('with admin set to true should be admin and save without error', function (done) {
            var testUser = userSpecUtil.getMockValidUser();
            testUser.admin = true;
            userLib.createUser(testUser, function (err, user) {
                if (err) {
                    done(err);
                } else {
                    should.exist(user);
                    user.admin.should.equal(true);
                    done();
                }

            });
        });

        it('should not save and give an error when displayName is not unique', function (done) {
            var testUser = userSpecUtil.getMockValidUser();
            userLib.createUser(testUser, function (err, user) {
                if (err) {
                    done(err);
                } else {
                    should.exist(user);
                    user.displayName.should.equal(testUser.displayName.toLowerCase());
                    userLib.createUser(testUser, function (err, user) {
                        should.exist(err);
                        should.not.exist(user);
                        done();
                    });
                }
            });
        });

    });


        describe('Creating a user with invalid inputs', function () {
            it('should not create a user with invalid inputs', function (done) {
                var testUser = userSpecUtil.getMockInvalidUser();
                userLib.createUser(testUser, function (err, user) {
                    should.exist(err);
                    should.not.exist(user);
                    done();
                });
            });
            // TODO: Do better validation testing here
        });

});