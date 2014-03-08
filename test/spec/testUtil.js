/*jslint node: true */
'use strict';

var env = process.env.NODE_ENV;

exports.init = function () {
    process.env.NODE_ENV = 'test';
    global.config = require('../../config/config');
};

exports.tearDown = function () {
    global.config = {};
    process.env.NODE_ENV = env;
};

exports.openDatabase = function (database, done) {
    database.openConnection(function () {
        done();
    }, done);
};

exports.dropDatabase = function (database, done) {
    /*
     0 = disconnected
     1 = connected
     2 = connecting
     3 = disconnecting
     */
    if (database.connection.readyState == 1) {
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
