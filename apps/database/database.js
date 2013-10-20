'use strict';

var mongoose = require('mongoose');
var configuration = require('../../config/conf');


var Database = function(){

    //  Scope.
    var self = this;
    this.connected = false;
    this.errorMessage = '';

    // Generate the Mongo Db connection URL
    var generate_mongo_url = function (dbConfig) {
        console.log(dbConfig);
        var url;
        if (dbConfig.username && dbConfig.password) {
            url = "mongodb://" + dbConfig.username + ":" + dbConfig.password + "@" + dbConfig.hostname + ":" + dbConfig.port + "/" + dbConfig.db;
        }
        else {
            url = "mongodb://" + dbConfig.hostname + ":" + dbConfig.port + "/" + dbConfig.db;
        }
        console.log(url);
        return url;
    };

    this.mongourl = generate_mongo_url(configuration.mongo);
    // Pull in the mongo client and related libs
    this.MongoClient = require('../../node_modules/mongodb').MongoClient;
    this.ObjectID = require('../../node_modules/mongodb').ObjectID;
    this.BSON = require('../../node_modules/mongodb').BSONPure;

    this.connect = function(){
        var db = mongoose.connection;

        db.on('error', function (error) {
            if (error) {
                self.errorMessage = error.toString();
            }
        });
        db.once('open', function () {
            self.connected = true;
        });
        console.log(this.mongourl);
        mongoose.connect(this.mongourl);
    }

};

module.exports = new Database();
