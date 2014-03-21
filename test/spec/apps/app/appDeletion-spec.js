/*jslint node: true */
'use strict';

var path = require('path');
var should = require('should');
var specUtil = require('../../spec-util');
var appSpecUtil = require('./app-spec-util');

describe('Application deletion', function () {
    var appLib;

    before(function () {
        appLib = require(global.config.apps.APP);
    });

    afterEach(function (done) {
        specUtil.dropDatabase(done);
    });


    describe('Deleting an app', function () {
        it('should delete an app and all associated posts');
    });

});