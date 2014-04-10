/*jslint node: true */
'use strict';
var path = require('path');
var should = require('should');
var specUtil = require('../../spec-util');
var userSpecUtil = require('./user-spec-util');

describe('User deletion', function () {
    var userLib;

    before(function () {
        userLib = require(global.config.modules.USER);
    });

    afterEach(function (done) {
        specUtil.dropDatabase(done);
    });

    describe('Deleting a User', function () {
        it('should delete a User including all the users clouds and apps');
    });

});