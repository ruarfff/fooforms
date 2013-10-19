'use strict';

var mongoose = require('mongoose');
var configuration = require('../../config/conf');


var Database = function(){

    //  Scope.
    var self = this;
    this.connected = false;

    // Generate the Mongo Db connection URL
    var generate_mongo_url = function (dbConfig) {
        console.log(dbConfig);
        dbConfig.hostname = (dbConfig.hostname || 'localhost');
        dbConfig.port = (dbConfig.port || 27017);
        dbConfig.db = (dbConfig.db || 'test');
        if (dbConfig.username && dbConfig.password) {
            return "mongodb://" + dbConfig.username + ":" + dbConfig.password + "@" + dbConfig.hostname + ":" + dbConfig.port + "/" + dbConfig.db;
        }
        else {
            return "mongodb://" + dbConfig.hostname + ":" + dbConfig.port + "/" + dbConfig.db;
        }
    };

    this.mongourl = generate_mongo_url(configuration.mongo);
    // Pull in the mongo client and related libs
    this.MongoClient = require('../../node_modules/mongodb').MongoClient;
    this.ObjectID = require('../../node_modules/mongodb').ObjectID;
    this.BSON = require('../../node_modules/mongodb').BSONPure;

    this.connect = function(){
        var db = mongoose.connection;

        db.on('error', console.error);
        db.once('open', function () {
            self.connected = true;
        });
        mongoose.connect(this.mongourl);
    }

};

module.exports = new Database();
