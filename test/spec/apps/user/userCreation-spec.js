/*jslint node: true */
'use strict';
var path = require('path');
var should = require('should');
var specUtil = require('../../spec-util');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

describe('User creation', function () {
    var userLib;
    var cloudLib;

    var mockValidUsers = [];
    var mockInvalidUsers = [];

    var mockValidUser = {};
    var mockInvalidUser = {};

    before(function () {
        userLib = require(global.config.apps.USER);
        cloudLib = require(global.config.apps.CLOUD);
    });

    beforeEach(function () {
        mockValidUsers = [
            {
                name: {
                    familyName: "Test Family Name",
                    givenName: "testGivenName",
                    middleName: "_*^%$£@!"
                },
                displayName: "Happy",
                email: "anemail@email.com",
                password: "AVerySecurePassword123"
            },
            {
                name: {
                    familyName: "Joe",
                    givenName: "John",
                    middleName: "Harry"
                },
                displayName: "sample-user",
                email: "testEmail1@email.com",
                password: "testPassword"
            },
            {
                name: {
                    familyName: "Maryijshdsdhfsfhjksdjfh",
                    givenName: "nsdknsdjknejew8973928e938",
                    middleName: "jhdkjshfkjh kj n jjnjk "
                },
                displayName: "asampleusernamewithNum395",
                email: "averylongemailaddress-938474_iohijoijojio@email.com",
                password: "averylongtestPassword2983798749872398792837923874938274983798"
            },
            {
                name: {
                    familyName: "£hihiuhui",
                    givenName: "0909823498",
                    middleName: "23872873"
                },
                displayName: "489u9289388923",
                email: "11229lalalalallal@email.co.uk",
                password: "testPassword_&**&^%^*&£%$&"
            }
        ];
        mockInvalidUsers = [{

        }];

        mockValidUser = mockValidUsers[getRandomInt(0, mockValidUsers.length - 1)];
        mockInvalidUser = mockInvalidUsers[getRandomInt(0, mockInvalidUsers.length - 1)];

    });

    afterEach(function (done) {
        specUtil.dropDatabase(done);
    });

    describe('Creating a user with valid inputs', function () {
        it('should create a User', function (done) {
            userLib.createUser(mockValidUser, function (err, user) {
                if (err) return done(err);
                    should.exist(user);
                    user.name.familyName.should.equal(mockValidUser.name.familyName);
                    user.name.givenName.should.equal(mockValidUser.name.givenName);
                    user.name.middleName.should.equal(mockValidUser.name.middleName);
                    user.displayName.should.equal(mockValidUser.displayName.toLowerCase());
                    user.password.should.not.equal(mockValidUser.password); // Password get encrypted
                    user.provider.should.equal('local');
                    user.admin.should.equal(false);
                    done();


            });
        });

        it('should create a User Cloud', function (done) {
            userLib.createUser(mockValidUser, function (err, user) {
                if (err) return done(err);
                should.exist(user);
                cloudLib.getCloudById(user.cloud, function (err, cloud) {
                    if (err) return done(err);
                    should.exist(cloud);
                    cloud.name.should.equal(user.displayName);
                    cloud.owner.should.eql(user._id);
                    cloud.menuLabel.should.equal(user.displayName);
                    cloud.icon.should.equal(user.photo);
                    should(cloud.isPrivate).ok;
                    should(cloud.isUserCloud).ok;
                    done();
                });
            });
        });

        it('with admin set to true should be admin and save without error', function (done) {
            mockValidUser.admin = true;
            userLib.createUser(mockValidUser, function (err, user) {
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
            userLib.createUser(mockValidUser, function (err, user) {
                if (err) {
                    done(err);
                } else {
                    should.exist(user);
                    user.displayName.should.equal(mockValidUser.displayName.toLowerCase());
                    userLib.createUser(mockValidUser, function (err, user) {
                        should.exist(err);
                        should.not.exist(user);
                        done();
                    });
                }
            });
        });

    });


    describe('Creating a user with invalid inputs', function () {


    });

});