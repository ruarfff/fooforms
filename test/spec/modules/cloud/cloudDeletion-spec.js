/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var testUtil = require('../../spec-util');
var cloudSpecUtil = require('./cloud-spec-util');
var log = require(global.config.modules.LOGGING).LOG;


describe('Cloud creation', function () {
    var cloudLib;
    var appLib;

    before(function () {
        cloudLib = require(global.config.modules.CLOUD);
        appLib = require(global.config.modules.APP);
    });

    beforeEach(function (done) {
        cloudSpecUtil.seedCloudsInDatabase(done);
    });

    afterEach(function (done) {
        testUtil.dropDatabase(done);
    });

    describe('Deleting a cloud', function () {
        it.skip('should delete a Cloud and all apps within', function (done) {
            cloudLib.addAppToCloud(cloudSpecUtil.getCloud1Id(), cloudSpecUtil.getApp1Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);

                cloud._id.should.eql(cloudSpecUtil.getCloud1Id());
                cloud.owner.should.eql(cloudSpecUtil.getUser1Id());

                cloud.should.have.property('apps').with.lengthOf(1);
                cloud.apps[0].should.eql(cloudSpecUtil.getApp1Id());
                cloudLib.deleteCloudById(cloud._id, function (err) {
                    should.not.exist(err);

                });

                done();
            });
        });
    });

});