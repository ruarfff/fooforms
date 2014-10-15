/*jslint node: true */
'use strict';

/* Set this before doing anything as the value is used during initialization */
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/*
 * Putting configuration in to global scope. It is a singleton and saves requiring long path names all over the place.
 * Sort of goes against best practice however so will look in to a better way of doing this (someday.....).
 */
global.config = require('./config/config')(env);

var http = require('http');
var express = require('express');
var passport = require('passport');
var path = require('path');
var fs = require('fs');

var database = require('./database/databaseGateway')();
var log = require('fooforms-logging').LOG;


var membership = require('./modules/membership');


process.on('uncaughtException', function (err) {
    console.error('uncaughtException:', err.message);
    console.error(err.stack);
    process.exit(1);
});

var FooFormsServerApp = function () {

    //  Scope.
    var self = this;

    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port
     */
    self.setupVariables = function () {
        self.ipaddress = "127.0.0.1";
        self.port = 3000;
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
            log.info(__filename, ' - ', '%s: Received %s - terminating app ...',
                new Date(Date.now()), sig);
            process.exit(1);
        }
        console.log('%s: Node server stopped.', new Date(Date.now()));
    };


    /**
     *  Set up termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function () {
        //  Process on exit and signals.
        process.on('exit', function () {
            self.terminator();
        });
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
            'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function (element) {
                process.on(element, function () {
                    self.terminator(element);
                });
            });
    };

    /**
     * Walks through a given path and requires all .js file within, including subdirectories.
     *
     * @param pathToWalk - Root location to walk from
     */
    self.walk = function (pathToWalk) {
        fs.readdirSync(pathToWalk).forEach(function (file) {
            var newPath = path.join(pathToWalk, file);
            var stat = fs.statSync(newPath);
            if (stat.isFile()) {
                if (/(.*)\.js/.test(file)) {
                    log.debug(__filename, ' - ', 'Requiring: ' + newPath);
                    require(newPath);
                }
            } else if (stat.isDirectory()) {
                self.walk(newPath);
            }
        });
    };

    /**
     * Load any models in the application to mongoose
     */
    self.bootstrapModels = function () {
        // Load the root models
        try {
            var rootModelsPath = path.join(global.config.root, 'models');
            if (fs.existsSync(rootModelsPath)) {
                self.walk(rootModelsPath);
            }
        } catch (err) {
            log.error(__filename, ' - ', err);
        }

        // Look for and load any app models
        var modulesPath = path.join(global.config.root, 'modules');
        fs.readdirSync(modulesPath).forEach(function (appDir) {
            var modelsPath = path.join(path.join(modulesPath, appDir), 'models');
            if (fs.existsSync(rootModelsPath)) {
                try {
                    var stat = fs.statSync(modelsPath);
                    if (stat.isDirectory()) {
                        self.walk(modelsPath);
                    }
                } catch (err) {
                    log.error(__filename, ' - ', err);
                }
            }
        });
    };


    /*  ================================================================  */
    /*  Application server functions (main app logic here).               */
    /*  ================================================================  */

    /**
     *  Start the server (starts up the application).
     */
    self.start = function () {
        log.info(__filename, ' - ', 'Starting web server...');
        http.createServer(self.app).listen(self.port, self.ipaddress, function () {
            log.info(__filename, ' - ', '%s: Node server started on %s:%d ...',
                new Date(Date.now()), self.ipaddress, self.port);
        });
    };

    /**
     *  Initializes the application.
     */
    self.initialize = function () {
        var mkdirp = require('mkdirp');
        mkdirp(path.join(global.config.root, 'logs'), function (err) {
            if (err) {
                // Console log here since the log util will fail on this error
                console.log(err.toString());
                return;
            }
            self.setupVariables();
            self.setupTerminationHandlers();
            self.bootstrapModels();
            membership.passport(passport);
            require('./config/express')(self.app, passport);
            require('./config/routes')(self.app, passport);

            log.info(__filename, ' - ', 'Running environment: ' + env);
            log.info(__filename, ' - ', 'Initializing database connection...');
            database.openConnection(
                // OK
                function () {
                    log.info(__filename, ' - ', 'Database connected to ' + database.url);
                },
                //Error
                function () {
                    log.error(__filename, ' - ', 'Database failed to connected to ' + database.url);
                });

            self.start();
        });
    };

};

var serverApp = new FooFormsServerApp();
serverApp.initialize();

exports.serverApp = module.exports = FooFormsServerApp;

