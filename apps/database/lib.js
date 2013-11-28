/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
var configuration = require('../../config/config');

var database = {};

// Generate the Mongo Db connection URL
var generateMongoUrl = function () {
    var dbConfig = configuration.mongo,
        url;

    if (dbConfig.username && dbConfig.password) {
        url = "mongodb://" + dbConfig.username + ":" + dbConfig.password + "@" + dbConfig.hostname + ":" + dbConfig.port + "/" + dbConfig.db;
    } else {
        url = "mongodb://" + dbConfig.hostname + ":" + dbConfig.port + "/" + dbConfig.db;
    }
    console.log(url);
    return url;
};

module.exports = {

    // Pull in the mongo client and related libs
    MongoClient : require('../../node_modules/mongodb').MongoClient,
    ObjectID : require('../../node_modules/mongodb').ObjectID,
    BSON : require('../../node_modules/mongodb').BSONPure,
    url : generateMongoUrl(),
    connected : false,
    errorMessage : '',
    connection : mongoose.connection,
    openConnection : function () {
        database.connection = mongoose.connection;
        database.connection.on('error', function (error) {
            if (error) {
                database.errorMessage = error.toString();
            }
        });
        database.connection.once('open', function () {
            database.connected = true;
        });
        console.log(database.url);
        mongoose.connect(database.url);
    }
};

