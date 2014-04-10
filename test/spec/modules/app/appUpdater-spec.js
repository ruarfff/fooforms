/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var specUtil = require('../../spec-util');
var appSpecUtil = require('./app-spec-util');

describe('Application updating', function () {
    var appLib;

    before(function () {
        appLib = require(global.config.modules.APP);
    });

    afterEach(function (done) {
        specUtil.dropDatabase(done);
    });


    describe('Update an app', function () {
        it('should update an app if it exists');
        it('should give an error if the app to update does not exist');
    });

});