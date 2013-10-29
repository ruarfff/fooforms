#!/bin/env node
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var database = require('./apps/database/database');
var http = require('http');
var express = require('express');
var passport = require('passport');
var path = require('path');
var fs = require('fs');
var config = require('./config/config');

var FooFormsServerApp = function () {

    //  Scope.
    var self = this;

    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function () {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        }
        // Set up the express object to initialize the application
        self.app = express();
    };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function (sig) {
        if (typeof sig === "string") {
            console.log('%s: Received %s - terminating app ...',
                Date(Date.now()), sig);
            process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()));
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function () {
        //  Process on exit and signals.
        process.on('exit', function () {
            self.terminator();
        });
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
            'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function (element, index, array) {
                process.on(element, function () {
                    self.terminator(element);
                });
            });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */


    /**
     *  Initializes the application.
     */
    self.initialize = function () {
        if (!fs.existsSync('./logs')) {
            fs.mkdirSync('./logs')
        }
        self.setupVariables();
        self.setupTerminationHandlers();

        require('./config/express')(self.app, passport);
        require('./config//routes')(self.app);
    };


    /**
     *  Start the server (starts up the application).
     */
    self.start = function () {
        http.createServer(self.app).listen(self.port, self.ipaddress, function () {
            console.log('%s: Node server started on %s:%d ...',
                Date(Date.now()), self.ipaddress, self.port);
        });
    };

};


/**
 *  main():  Main code.
 */
console.log("Initializing database connection...");
database.connect();
console.log("Successfully connected to database at " + database.mongourl);
console.log("Starting web server...");
var serverApp = new FooFormsServerApp();
serverApp.initialize();
serverApp.start();

exports = module.exports = serverApp;

