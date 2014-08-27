/*jslint node: true */
'use strict';

var path = require('path');
var mongoose = require('mongoose');

var database = function(databaseConfig) {
    var connection = mongoose.connection,
        connected = false,
        errorMessage = '';

    if(!databaseConfig) {
        databaseConfig = global.config.database;
    }

    var url = databaseConfig.url;


    var rootPath = path.normalize(__dirname + '/../');
    var mongoModule = path.join(rootPath, 'node_modules/mongodb');

    return {
        // Pull in the mongo client and related libs
        MongoClient: require(mongoModule).MongoClient,
        ObjectID: require(mongoModule).ObjectID,
        BSON: require(mongoModule).BSONPure,
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
