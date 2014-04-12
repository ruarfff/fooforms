/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';
var path = require('path');
var should = require('should');
var specUtil = require('../../spec-util');
var userSpecUtil = require('./user-spec-util');

describe('User deletion', function () {
    var userLib;
    var cloudLib;

    before(function () {
        userLib = require(global.config.modules.USER);
        cloudLib = require(global.config.modules.CLOUD);
    });

    afterEach(function (done) {
        specUtil.dropDatabase(done);
    });

    describe('Deleting a User', function () {
        it('should delete a User including all the users clouds', function (done) {
            var testUser = userSpecUtil.getMockValidUser();
            userLib.createUser(testUser, function (err, user) {
                if (err) {
                    return done(err);
                }
                should.exist(user);
                var cloudId = user.cloud;
                cloudLib.getCloudById(cloudId, function (err, cloud) {
                    if (err) {
                        return done(err);
                    }
                    should.exist(cloud);
                    userLib.deleteUserById(user._id, function (err) {
                        should.not.exist(err);
                        userLib.findById(user._id, function (err, user) {
                            should.not.exist(err);
                            should.not.exist(user);
                            cloudLib.getCloudById(cloudId, function (err, cloud) {
                                if (err) {
                                    return done(err);
                                }
                                should.not.exist(cloud);
                                done();
                            });
                        });
                    });
                });
            });
        });
    });

});