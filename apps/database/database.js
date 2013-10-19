'use strict';

var mongoose = require('mongoose');
var configuration = require('../../config/conf');

var mongo;

mongo = {
    "hostname": process.env.OPENSHIFT_MONGODB_DB_HOST,
    "port": process.env.OPENSHIFT_MONGODB_DB_PORT,
    "username": "admin",
    "password": "hE6DLZs5m4C4",
    "name": "admin",
    "db": "dev"
};

var Database = function(){

    // Generate the Mongo Db connection URL
    var generate_mongo_url = function (obj) {
        obj.hostname = (obj.hostname || 'localhost');
        obj.port = (obj.port || 27017);
        obj.db = (obj.db || 'test');
        if (obj.username && obj.password) {
            return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
        }
        else {
            return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
        }
    };

    this.mongourl = generate_mongo_url(configuration.mongo);

    // Pull in the mongo client and related libs
    this.MongoClient = require('../../node_modules/mongodb').MongoClient;
    this.ObjectID = require('../../node_modules/mongodb').ObjectID;
    this.BSON = require('../../node_modules/mongodb').BSONPure;

    this.connect = function(){
        var connectionString;
        mongo.hostname = (mongo.hostname || 'localhost');
        mongo.port = (mongo.port || 27017);
        mongo.db = (mongo.db || 'test');
        if (mongo.username && mongo.password) {
            connectionString = "mongodb://" + mongo.username + ":" + mongo.password + "@" + mongo.hostname + ":" + mongo.port + "/" + mongo.db;
        }
        else {
            connectionString = "mongodb://" + mongo.hostname + ":" + mongo.port + "/" + mongo.db;
        }
        mongoose.connect(this.mongourl);
    }

};

module.exports = new Database();
