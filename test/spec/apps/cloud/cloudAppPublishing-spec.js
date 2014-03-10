/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var specUtil = require('../../spec-util');
var cloudSpecUtil = require('./cloud-spec-util');

describe('Publishing, Updating and Removing Apps in Clouds', function () {
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

    describe('Publishing App to User Cloud', function () {
        it('should update the app list with the new app if App Owner is Cloud Owner', function (done) {
            cloudLib.addAppToCloud(cloudSpecUtil.getCloud1Id(), cloudSpecUtil.getApp1Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.not.exist(err);
                should.exist(cloud);

                cloud._id.should.eql(cloudSpecUtil.getCloud1Id());
                cloud.owner.should.eql(cloudSpecUtil.getUser1Id());

                cloud.should.have.property('apps').with.lengthOf(1);
                cloud.apps[0].should.eql(cloudSpecUtil.getApp1Id());

                done();
            });
        });
        it('should update the app list with the new app if App Owner is not Cloud Owner but is in the writeable members list');
        it('should Not update the app list with the new app if App Owner is Not Cloud Owner and Not in the writeable members list');
    });

    describe('Updating App in User Cloud', function () {
        it('should update an existing app with the new data if App Owner is Cloud Owner');
    });

    describe('Removing Apps from User Cloud', function () {
        it('should should remove an App from Cloud if User is Cloud Owner');
    });

});