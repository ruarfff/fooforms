/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var testUtil = require('../spec-util');
var folderSpecUtil = require('./folder-spec-util');
var log = require(global.config.modules.LOGGING).LOG;


describe('Folder deletion', function () {
    var folderLib;
    var formLib;

    before(function () {
        folderLib = require(global.config.modules.FOLDER);
        formLib = require(global.config.modules.FORM);
    });

    beforeEach(function (done) {
        folderSpecUtil.seedFoldersInDatabase(done);
    });

    afterEach(function () {
        testUtil.dropDatabase();
    });

    describe('Deleting a folder', function () {
        it('should delete a Folder and all forms within', function (done) {
            folderLib.addFormToFolder(folderSpecUtil.getFolder1Id(), folderSpecUtil.getForm1Id(), function (err, folder) {
                if (err) {
                    return done(err);
                }
                should.exist(folder);

                folder._id.should.eql(folderSpecUtil.getFolder1Id());
                folder.owner.should.eql(folderSpecUtil.getUser1Id());

                folder.should.have.property('forms').with.lengthOf(1);
                folder.forms[0].should.eql(folderSpecUtil.getForm1Id());
                folderLib.deleteFolderById(folder._id, function (err) {
                    should.not.exist(err);
                    formLib.getFormById(folderSpecUtil.getForm1Id(), function (err, form) {
                        should.not.exist(err);
                        should.not.exists(form);
                        done();
                    });
                });
            });
        });
    });

});