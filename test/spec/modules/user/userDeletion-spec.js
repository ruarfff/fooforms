/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';
var path = require('path');
var should = require('should');
var specUtil = require('../spec-util');
var userSpecUtil = require('./user-spec-util');

describe('User deletion', function () {
    var userLib;
    var folderLib;

    before(function () {
        userLib = require(global.config.modules.USER);
        folderLib = require(global.config.modules.FOLDER);
    });

    afterEach(function () {
        specUtil.dropDatabase();
    });

    describe('Deleting a User', function () {
        it('should delete a User including all the users folders', function (done) {
            var testUser = userSpecUtil.getMockValidUser();
            userLib.createUser(testUser, function (err, user) {
                if (err) {
                    return done(err);
                }
                should.exist(user);
                var folderId = user.folder;
                folderLib.getFolderById(folderId, function (err, folder) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(folder);
                    userLib.deleteUserById(user._id, function (err) {
                        should.not.exist(err);
                        userLib.findById(user._id, function (err, user) {
                            should.not.exist(err);
                            should.not.exist(user);
                            folderLib.getFolderById(folderId, function (err, folder) {
                                if (err) {
                                    return done(err);
                                }
                                should.not.exist(folder);
                                done();
                            });
                        });
                    });
                });
            });
        });
    });

});