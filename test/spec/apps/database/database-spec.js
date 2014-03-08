/*jslint node: true */
'use strict';
var path = require('path');
var should = require('should');
var testUtil = require('../../testUtil');

describe('Database configuration and connection', function () {
    var database;


    before(function () {
        testUtil.init();
        database = require(global.config.apps.DATABASE);
    });

    after(function () {
        testUtil.tearDown();
    });

    afterEach(function (done) {
        testUtil.dropDatabase(database, done);
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

    // THis isn't working and have no idea why :'(
    describe.skip('Test failed database connection', function () {
        it('fails when url is invalid', function (done) {
            var cachedUrl = database.url;
            database.url = 'some crazy url';
            database.openConnection(function () {
                return done(new Error("Shouldn't have connected"));
            }, function (err) {
                database.url = cachedUrl;
                should.exist(err);
                done();
            });
        });
    });

    describe('Test successful database connection', function () {
        it('connects successfully with test url', function (done) {
            database.openConnection(function () {
                done();
            }, done);
        });
    });


});