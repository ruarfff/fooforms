/*jslint node: true */
/*global describe, it */

'use strict';
var should = require('should');

describe('Database configuration and connection', function () {

    describe('Test database config initialisation', function () {
        it('node environment is test', function () {
            process.env.NODE_ENV.should.equal('test');
        });
    });

});