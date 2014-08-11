/*jslint node: true */
'use strict';

var path = require('path');
var mongoose = require('mongoose');

var database = function(databaseConfig) {
    var connection = mongoose.connection,
        name = 'db',
        connected = false,
        url = 'not set',
        errorMessage = '';

    if(!databaseConfig) {
        databaseConfig = global.config.database;
    }

    name = databaseConfig.db;
    if (databaseConfig.username && databaseConfig.password) {
        url = "mongodb://" + databaseConfig.username + ":" + databaseConfig.password + "@" + databaseConfig.hostname + ":" + databaseConfig.port + "/" + databaseConfig.db;
    } else {
        url = "mongodb://" + databaseConfig.hostname + ":" + databaseConfig.port + "/" + databaseConfig.db;
    }
    var rootPath = path.normalize(__dirname + '/../');
    var mongoModule = path.join(rootPath, 'node_modules/mongodb');

    return {
        // Pull in the mongo client and related libs
        MongoClient: require(mongoModule).MongoClient,
        ObjectID: require(mongoModule).ObjectID,
        BSON: require(mongoModule).BSONPure,
        name: name,
        url: url,
        connected: connected,
        errorMessage: errorMessage,
        connection: connection,
        openConnection: function (next, onError) {
            connection.on('error', function (error) {
                if (error) {
                    errorMessage = error.toString();
                    console.log('Error opening DB: ' + errorMessage);
                }
                if (typeof(onError) == "function") {
                    onError(error);
                }
            });
            connection.once('open', function () {
                connected = true;
                if (typeof(next) == "function") {
                    next();
                }
            });

            mongoose.connect(this.url);
        },
        closeConnection: function (next) {
            mongoose.disconnect(function (err) {

                if (err) {
                    console.log('Error closing DB ' + err.toString());
                    if (typeof(next) == "function") {
                        next(err);
                    }
                }
                else {
                    connected = false;
                    if (typeof(next) == "function") {
                        next();
                    }
                }
            });
        }
    };
};

module.exports = database;
