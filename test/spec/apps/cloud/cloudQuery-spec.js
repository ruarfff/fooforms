/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var specUtil = require('../../spec-util');
var cloudSpecUtil = require('./cloud-spec-util');

describe('Querying Cloud Library to get Clouds and Cloud details', function () {
    var database;
    var cloudLib;

    before(function () {
        specUtil.init();
        database = require(global.config.apps.DATABASE);
        cloudLib = require(global.config.apps.CLOUD);
    });

    after(function () {
        specUtil.tearDown();
    });

    beforeEach(function (done) {
        specUtil.openDatabase(database, function (err) {
            if (err) {
                return done(err);
            }
            cloudSpecUtil.seedCloudsInDatabase(done);
        });
    });

    afterEach(function (done) {
        specUtil.dropDatabase(database, done);
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
    });


});