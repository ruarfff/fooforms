/*jslint node: true */
'use strict';

var path = require('path');
var mongoose = require('mongoose');
var log = require(global.config.apps.LOGGING).LOG;

var database = {
    connection: mongoose.connection,
    name: 'db',
    connected: false,
    url: 'not set',
    errorMessage: ''
};

// Generate the Mongo Db connection URL
function initialize(dbConfig) {
    database.name = dbConfig.db;
    if (dbConfig.username && dbConfig.password) {
        database.url = "mongodb://" + dbConfig.username + ":" + dbConfig.password + "@" + dbConfig.hostname + ":" + dbConfig.port + "/" + dbConfig.db;
    } else {
        database.url = "mongodb://" + dbConfig.hostname + ":" + dbConfig.port + "/" + dbConfig.db;
    }
    log.debug(database.url);
}

initialize(global.config.database);

var mongoModule = path.join(global.config.root, 'node_modules/mongodb');

module.exports = {

    // Pull in the mongo client and related libs
    MongoClient: require(mongoModule).MongoClient,
    ObjectID: require(mongoModule).ObjectID,
    BSON: require(mongoModule).BSONPure,
    name: database.name,
    url: database.url,
    connected: database.connected,
    errorMessage: database.errorMessage,
    connection: database.connection,
    openConnection: function (next, onError) {
        database.connection.on('error', function (error) {
            if (error) {
                database.errorMessage = error.toString();
                log.error('Error opening DB: ' + database.errorMessage);
            }
            if (typeof(onError) == "function") {
                onError(error);
            }
        });
        database.connection.once('open', function () {
            log.info('Successfully connected to database at ' + database.url);
            database.connected = true;
            if (typeof(next) == "function") {
                next();
            }
        });

        mongoose.connect(this.url);
    },
    closeConnection: function (next) {
        mongoose.disconnect(function (err) {

            if (err) {
                log.error('Error closing DB');
                if (typeof(next) == "function") {
                    next(err);
                }
            }
            else {
                database.connected = false;
                log.info('DB Closed');
                if (typeof(next) == "function") {
                    next();
                }
            }
        });
    }
};

