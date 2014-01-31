/*jslint node: true */
'use strict';

var path = require( 'path' );
var mongoose = require( 'mongoose' );
var log = require( global.config.apps.LOGGING ).LOG;

var database = {
    connection: mongoose.connection,
    connected: false,
    url: 'not set',
    errorMessage: ''
};

// Generate the Mongo Db connection URL
function setUrl () {
    var dbConfig = global.config.database;

    if ( dbConfig.username && dbConfig.password ) {
        database.url = "mongodb://" + dbConfig.username + ":" + dbConfig.password + "@" + dbConfig.hostname + ":" + dbConfig.port + "/" + dbConfig.db;
    } else {
        database.url = "mongodb://" + dbConfig.hostname + ":" + dbConfig.port + "/" + dbConfig.db;
    }
    log.debug( database.url );
}
setUrl();
var mongoModule = path.join( global.config.root, 'node_modules/mongodb' );

module.exports = {

    // Pull in the mongo client and related libs
    MongoClient: require( mongoModule ).MongoClient,
    ObjectID: require( mongoModule ).ObjectID,
    BSON: require( mongoModule ).BSONPure,
    url: database.url,
    connected: database.connected,
    errorMessage: database.errorMessage,
    connection: database.connection,
    openConnection: function () {
        database.connection.on( 'error', function ( error ) {
            if ( error ) {
                database.errorMessage = error.toString();
                log.error( 'Error opening DB: ' + database.errorMessage );
            }
        } );
        database.connection.once( 'open', function () {
            log.info( 'Successfully connected to database at ' + database.url );
            database.connected = true;
        } );
        mongoose.connect( database.url );
    },
    closeConnection: function () {
        mongoose.disconnect( function ( err ) {

            if ( err ) {
                log.error( 'Error closing DB' );
            }
            else {
                log.info( 'DB Closed' );
            }
        } );
    }
};

