/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

var path = require('path');
var should = require('should');
var testUtil = require('../../spec-util');
var cloudSpecUtil = require('./cloud-spec-util');
var log = require(global.config.modules.LOGGING).LOG;


describe('Cloud deletion', function () {
    var cloudLib;
    var formLib;

    before(function () {
        cloudLib = require(global.config.modules.CLOUD);
        formLib = require(global.config.modules.FORM);
    });

    beforeEach(function (done) {
        cloudSpecUtil.seedCloudsInDatabase(done);
    });

    afterEach(function (done) {
        testUtil.dropDatabase(done);
    });

    describe('Deleting a cloud', function () {
        it('should delete a Cloud and all forms within', function (done) {
            cloudLib.addFormToCloud(cloudSpecUtil.getCloud1Id(), cloudSpecUtil.getForm1Id(), function (err, cloud) {
                if (err) {
                    return done(err);
                }
                should.exist(cloud);

                cloud._id.should.eql(cloudSpecUtil.getCloud1Id());
                cloud.owner.should.eql(cloudSpecUtil.getUser1Id());

                cloud.should.have.property('forms').with.lengthOf(1);
                cloud.forms[0].should.eql(cloudSpecUtil.getForm1Id());
                cloudLib.deleteCloudById(cloud._id, function (err) {
                    should.not.exist(err);
                    formLib.getFormById(cloudSpecUtil.getForm1Id(), function (err, form) {
                        should.not.exist(err);
                        should.not.exists(form);
                        done();
                    });
                });
            });
        });
    });

});