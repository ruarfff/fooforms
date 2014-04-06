/*jslint node: true */
'use strict';
var path = require('path');
var should = require('should');
var specUtil = require('./spec-util');

describe('Database configuration and connection', function () {

    describe('Test database config initialisation', function () {
        it('node environment is test', function () {
            process.env.NODE_ENV.should.equal('test');
        });

        it('database config loads correctly', function () {
            global.config.apps.DATABASE.should.equal(path.join(global.config.root, 'modules/database'));
        });

        it('database is test', function () {
            specUtil.database.name.should.equal('test');
        });

        it('database url is correct for test config', function () {
            specUtil.database.url.should.equal('mongodb://localhost:27017/test');
        });

        it('database should be connected', function () {
            should(specUtil.database.connection.readyState === 1).ok;
        });

    });

});