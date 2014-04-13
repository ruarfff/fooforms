/*jslint node: true */

'use strict';

var path = require('path');
var should = require('should');
var specUtil = require('../../spec-util');
var folderSpecUtil = require('./folder-spec-util');

describe('Querying Folder Library to get Folders and Folder details', function () {
    var folderLib;

    before(function () {
        folderLib = require(global.config.modules.FOLDER);
    });

    beforeEach(function (done) {
        folderSpecUtil.seedFoldersInDatabase(done);
    });

    afterEach(function (done) {
        specUtil.dropDatabase(done);
    });

    describe('Folder retrieval', function () {
        it('should return all folders in the database', function (done) {
            folderLib.getAllFolder(function (err, folders) {
                if (err) {
                    return done(err);
                }
                should.exist(folders);
                folders.length.should.equal(folderSpecUtil.numberOfFolders);
                done();
            });
        });
        it('should find a folder based on the folder Id', function (done) {
            folderLib.getFolderById(folderSpecUtil.getFolder2Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);
                folder._id.should.eql(folderSpecUtil.getFolder2Id());
                folder.name.should.equal("folder2");
                done();
            });
        });
        it('should not find a folder when an ID that does not exist is used to query', function (done) {
            var id = folderSpecUtil.getFolder1Id();
            folderLib.deleteFolderById(id, function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.not.exist(folder);
                folderLib.getFolderById(id, function (err, folder) {
                    if (err) {
                        return done(err);
                    }
                    should.not.exist(folder);
                    done();
                });
            });
        });
        it('should find all folders owned by a user', function (done) {
            folderLib.getFolderFolders(folderSpecUtil.getUser4Id(), function (err, folders) {
                if (err) {
                    return done(err);
                }
                should.exist(folders);
                folders.length.should.equal(1);
                folders[0].name.should.equal("folder4");
                folders[0]._id.should.eql(folderSpecUtil.getFolder4Id());
                done();
            });
        });
        it('should find a folder by its name', function (done) {
            folderLib.getFolderByName('folder1', function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);
                folder._id.should.eql(folderSpecUtil.getFolder1Id());
                done();
            });
        });
        it('should not find a folder by its name if the folder does not exist', function (done) {
            var id = folderSpecUtil.getFolder2Id();
            folderLib.deleteFolderById(id, function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.not.exist(folder);
                folderLib.getFolderByName('folder2', function (err, folder) {
                    if (err) {
                        return done(err);
                    }
                    should.not.exist(folder);
                    done();
                });
            });
        });
    });

    describe('Folder data retrieval', function () {
        it('should get the folders owner', function (done) {
            folderLib.getFolderOwner(folderSpecUtil.getFolder4Id(), function (err, user) {
                if (err) {
                    return done(err);
                }
                should.exist(user);
                user._id.should.eql(folderSpecUtil.getUser4Id());
                user.displayName.should.equal('user4');
                done();
            });
        });
    });


});