/*jslint node: true */
'use strict';
var path = require('path');
var should = require('should');

describe('Database configuration and connection', function () {
    var database;
    var env = process.env.NODE_ENV;

    before(function () {
        process.env.NODE_ENV = 'test';
        global.config = require('../../../../config/config');
        database = require(global.config.apps.DATABASE);
    });

    after(function () {
        global.config = {};
        process.env.NODE_ENV = env;
    });

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

    });

    describe('Test database connection', function () {

        it('fails when url is invalid', function (done) {
            var cachedUrl = database.url;
            database.url = 'some crazy url';
            database.openConnection(function (err) {
                database.url = cachedUrl;
                should.exist(null, err);
                done();
            });
        });

        it('connects successfully with test url', function (done) {
            database.openConnection(function () {
                done();
            }, null);
        });
    });


});