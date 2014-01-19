/*jslint node: true */
'use strict';

var mongoose = require( 'mongoose' );

var database = {};

var connection = mongoose.connection;
var connected = false;
var url = 'not set';
var errorMessage = '';

// Generate the Mongo Db connection URL
function setUrl () {
    var dbConfig = global.config.database;

    if ( dbConfig.username && dbConfig.password ) {
        url = "mongodb://" + dbConfig.username + ":" + dbConfig.password + "@" + dbConfig.hostname + ":" + dbConfig.port + "/" + dbConfig.db;
    } else {
        url = "mongodb://" + dbConfig.hostname + ":" + dbConfig.port + "/" + dbConfig.db;
    }
    console.log( url );
}
setUrl();

module.exports = {

    // Pull in the mongo client and related libs
    MongoClient: require( '../../../node_modules/mongodb' ).MongoClient,
    ObjectID: require( '../../../node_modules/mongodb' ).ObjectID,
    BSON: require( '../../../node_modules/mongodb' ).BSONPure,
    url: url,
    connected: connected,
    errorMessage: errorMessage,
    connection: connection,
    openConnection: function () {
        connection.on( 'error', function ( error ) {
            if ( error ) {
                console.error( 'Error opening DB: ' + error.toString() );
                errorMessage = error.toString();
            }
        } );
        connection.once( 'open', function () {
            console.log( 'Successfully connected to database at ' + url );
            connected = true;
        } );
        mongoose.connect( url );
    },
    closeConnection: function () {
        mongoose.disconnect( function ( err ) {

            if ( err ) {
                console.error( 'Error closing DB' );
            }
            else {
                console.log( 'DB Closed' );
            }
        } );
    }
};

