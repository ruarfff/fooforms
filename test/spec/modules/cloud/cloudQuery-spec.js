/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var specUtil = require('../../spec-util');
var cloudSpecUtil = require('./cloud-spec-util');

describe('Querying Cloud Library to get Clouds and Cloud details', function () {
    var cloudLib;

    before(function () {
        cloudLib = require(global.config.apps.CLOUD);
    });

    beforeEach(function (done) {
        cloudSpecUtil.seedCloudsInDatabase(done);
    });

    afterEach(function (done) {
        specUtil.dropDatabase(done);
    });

    describe('Cloud retrieval', function () {
        it('should return all clouds in the database', function (done) {
            cloudLib.getAllClouds(function (err, clouds) {
                if (err) {
                    return done(err);
                }
                should.exist(clouds);
                clouds.length.should.equal(cloudSpecUtil.numberOfClouds);
                done();
            });
        });
        it('should find a cloud based on the cloud Id', function (done) {
            cloudLib.getCloudById(cloudSpecUtil.getCloud2Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);
                cloud._id.should.eql(cloudSpecUtil.getCloud2Id());
                cloud.name.should.equal("cloud2");
                done();
            });
        });
        it('should not find a cloud when an ID that does not exist is used to query', function (done) {
            var id = cloudSpecUtil.getCloud1Id();
            cloudLib.deleteCloudById(id, function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.not.exist(cloud);
                cloudLib.getCloudById(id, function (err, cloud) {
                    if (err) {
                        return done(err);
                    }
                    should.not.exist(cloud);
                    done();
                });
            });
        });
        it('should find all clouds owned by a user', function (done) {
            cloudLib.getUserClouds(cloudSpecUtil.getUser4Id(), function (err, clouds) {
                if (err) {
                    return done(err);
                }
                should.exist(clouds);
                clouds.length.should.equal(1);
                clouds[0].name.should.equal("cloud4");
                clouds[0]._id.should.eql(cloudSpecUtil.getCloud4Id());
                done();
            });
        });
        it('should find a cloud by its name', function (done) {
            cloudLib.getCloudByName('cloud1', function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);
                cloud._id.should.eql(cloudSpecUtil.getCloud1Id());
                done();
            });
        });
        it('should not find a cloud by its name if the cloud does not exist', function (done) {
            var id = cloudSpecUtil.getCloud2Id();
            cloudLib.deleteCloudById(id, function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.not.exist(cloud);
                cloudLib.getCloudByName('cloud2', function (err, cloud) {
                    if (err) {
                        return done(err);
                    }
                    should.not.exist(cloud);
                    done();
                });
            });
        })
    });

    describe('Cloud data retrieval', function () {
        it('should get the clouds owner', function (done) {
            cloudLib.getCloudOwner(cloudSpecUtil.getCloud4Id(), function (err, user) {
                if (err) {
                    return done(err);
                }
                should.exist(user);
                user._id.should.eql(cloudSpecUtil.getUser4Id());
                user.displayName.should.equal('user4');
                done();
            });
        });
    });


});