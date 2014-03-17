/*jslint node: true */
'use strict';
var path = require('path');
var should = require('should');
var specUtil = require('./spec-util');
var database;

before(function (done) {
    specUtil.init();
    database = require(global.config.apps.DATABASE);
    specUtil.openDatabase(database, done);
    specUtil.dropDatabase(database, done);
});

after(function (done) {
    specUtil.tearDown();
    specUtil.closeDatabase(database, done)
});

describe('Database configuration and connection', function () {

    describe('Test database config initialisation', function () {
        it('node environment is test', function () {
            process.env.NODE_ENV.should.equal('test');
        });

        it('database config loads correctly', function () {
            global.config.apps.DATABASE.should.equal(path.join(global.config.root, 'apps/database'));
        });

        it('database is test', function () {
            database.name.should.equal('test');
        });

        it('database url is correct for test config', function () {
            database.url.should.equal('mongodb://localhost:27017/test');
        });

        it('database should be connected', function () {
            should(database.connection.readyState === 1).ok;
        });

    });

});