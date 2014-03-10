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

exports.dropDatabase = function (database, done) {
    /*
     *   Possible connection states that may be available in database.connection.readyState  
     */
    var _disconnected = 0,
        _connected = 1,
        _connecting = 2,
        _disconnecting = 3;

    if (database.connection.readyState == _connected) {
        database.connection.db.dropDatabase(function (err) {
            database.closeConnection(function (closeErr) {
                if (err) {
                    console.error('Error: ' + err);
                    done(err);
                } else {
                    console.log('Successfully dropped db');
                    if (closeErr) {
                        done(closeErr);
                    } else {
                        done();
                    }
                }
            });
        });
    } else {
        database.openConnection(function () {
            database.connection.db.dropDatabase(function (err) {
                database.closeConnection(function (closeErr) {
                    if (err) {
                        console.error('Error: ' + err);
                        done(err);
                    } else {
                        console.log('Successfully dropped db');
                        if (closeErr) {
                            done(closeErr);
                        } else {
                            done();
                        }
                    }
                });
            });
        }, done);
    }
};
