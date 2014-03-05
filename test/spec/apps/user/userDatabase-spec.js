/*jslint node: true */
'use strict';
var path = require('path');
var should = require('should');
var testUtil = require('../../testUtil');

describe('User database functions', function () {
    var database;
    var userLib;

    before(function () {
        testUtil.init();
        database = require(global.config.apps.DATABASE);
        userLib = require(global.config.apps.USER);
    });

    after(function () {
        testUtil.tearDown();
    });

    beforeEach(function (done) {
        testUtil.openDatabase(database, done);
    });

    afterEach(function (done) {
        testUtil.dropDatabase(database, done);
    });

    describe('Creating a user', function () {
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

        it('should be admin and save without error', function (done) {
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

});