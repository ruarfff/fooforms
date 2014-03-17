/*jslint node: true */
'use strict';

var env = process.env.NODE_ENV;

exports.init = function () {
    process.env.NODE_ENV = 'test'; // Setting NODE_ENV to test ensures the test config (/config/env/test.json) gets loaded
    global.config = require('../../config/config'); // Load the test config and assign it to global
};

exports.tearDown = function () {
    global.config = {}; // Make sure no test confgurations remain loaded.
    process.env.NODE_ENV = env; // Switch back the NODE_ENV to whatever it was before the tests were run.
};

exports.openDatabase = function (database, done) {
    // This really doesn't save any code but ensures a single way of opening the db in case the method needs ot be changed later
    database.openConnection(function () {
        done();
    }, done);
};

exports.closeDatabase = function (database, done) {
    database.closeConnection(function (err) {
        if (err) {
            console.log(err.toString());
            return done(err);
        }
        console.log('Connection closed');
        done();
    });
};

exports.dropDatabase = function (database, done) {
    database.connection.db.dropDatabase(function (err) {
        if (err) {
            console.error('Error: ' + err);
            return done(err);
        }
        console.log('Successfully dropped db');
        return done();
    });
};
