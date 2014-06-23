/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

var env = process.env.NODE_ENV || "development";
process.env.NODE_ENV = 'test'; // Setting NODE_ENV to test ensures the test config (/config/env/test.json) gets loaded
global.config = require('../../../config/config')(); // Load the test config and assign it to global
var database = require(global.config.modules.DATABASE)();

var tearDown = function () {
    global.config = {}; // Make sure no test configurations remain loaded.
    process.env.NODE_ENV = env; // Switch back the NODE_ENV to whatever it was before the tests were run.
};

var openTestDatabase = function (done) {
    // This really doesn't save any code but ensures a single way of opening the db in case the method needs ot be changed later
    database.openConnection(function () {
        done();
    }, done);
};

var closeDatabase = function (done) {
    database.closeConnection(function (err) {
        if (err) {
            console.log(err.toString());
            return done(err);
        }
        console.log('Connection closed');
        done();
    });
};

var dropDatabase = function (done) {
    database.connection.db.dropDatabase(function (err) {
        if (err) {
            console.error('Error: -' + err);
            return done(err);
        }
        console.log('Successfully dropped db');
        return done();
    });
};

before(function (done) {
    openTestDatabase(done);
    dropDatabase(done);
});

after(function (done) {
    tearDown();
    closeDatabase(done);
});


module.exports = {
    database: database,
    dropDatabase: dropDatabase
};
