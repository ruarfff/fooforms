/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */

'use strict';
var path = require('path');
var should = require('should');
var specUtil = require('./spec-util');

describe('Database configuration and connection', function () {

    describe('Test database config initialisation', function () {
        it('node environment is test', function () {
            process.env.NODE_ENV.should.equal('test');
        });

    });

});