/*jslint node: true */
'use strict';
var path = require('path');
var should = require('should');
var specUtil = require('../../spec-util');

describe('User creation functions', function () {
    var database;
    var userLib;

    before(function () {
        specUtil.init();
        database = require(global.config.apps.DATABASE);
        userLib = require(global.config.apps.USER);
    });

    after(function () {
        specUtil.tearDown();
    });

    beforeEach(function (done) {
        specUtil.openDatabase(database, done);
    });

    afterEach(function (done) {
        specUtil.dropDatabase(database, done);
    });

    describe('Creating a user with valid inputs', function () {
        var testName = {
            familyName: "Test Family Name",
            givenName: "testGivenName",
            middleName: "_*^%$£@!"
        };
        var testDisplayName = "Test Display Name";
        var testEmail = "test@test.com";
        var testPassword = "some-password";
        var mockUser;
        beforeEach(function () {
            mockUser = {
                name: testName,
                displayName: testDisplayName,
                email: testEmail,
                password: testPassword
            };
        });

        it('should save without error', function (done) {
            userLib.createUserLocalStrategy(mockUser, function (err, user) {
                if (err) {
                    done(err);
                } else {
                    should.exist(user);
                    user.name.familyName.should.equal(testName.familyName);
                    user.name.givenName.should.equal(testName.givenName);
                    user.name.middleName.should.equal(testName.middleName);
                    user.displayName.should.equal(testDisplayName);
                    user.password.should.not.equal(testPassword);
                    user.provider.should.equal('local');
                    user.admin.should.equal(false);
                    done();
                }

            });
        });

        it('with admin set to true should be admin and save without error', function (done) {
            mockUser.admin = true;
            userLib.createUserLocalStrategy(mockUser, function (err, user) {
                if (err) {
                    done(err);
                } else {
                    should.exist(user);
                    user.admin.should.equal(true);
                    done();
                }

            });
        });

    });


    describe('Creating a user with invalid inputs', function () {
        var testName = {
            familyName: "Test Family Name",
            givenName: "testGivenName",
            middleName: "_*^%$£@!"
        };
        var testDisplayName = "TestDisplayName";
        var testEmail = "test@test.com";
        var testPassword = "some-password";
        var mockUser;
        beforeEach(function () {
            mockUser = {
                name: testName,
                displayName: testDisplayName,
                email: testEmail,
                password: testPassword
            };
        });

        it('should not save and give an error when displayName is not unique', function (done) {
            userLib.createUserLocalStrategy(mockUser, function (err, user) {
                if (err) {
                    done(err);
                } else {
                    should.exist(user);
                    user.displayName.should.equal(testDisplayName);
                    userLib.createUserLocalStrategy(mockUser, function (err, user) {
                        should.exist(err);
                        should.not.exist(user);
                        done();
                    });
                }
            });
        });
    });

});