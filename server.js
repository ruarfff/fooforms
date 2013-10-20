#!/bin/env node
var database = require('./apps/database/database');
var http = require('http');
var express = require('express');
var controllers = require('./controllers');
var path = require('path');
var fs = require('fs')

var FooFormsServerApp = function () {

    //  Scope.
    var self = this;
    var app = express();

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

        // Removed 'SIGPIPE' from the list - bugz 852598.
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
        self.setupVariables();
        self.setupTerminationHandlers();
        var expressLogFile = fs.createWriteStream('./logs/express.log', {flags: 'a'});

        app.configure(function () {
            app.set('title', 'fooforms');
            app.set('port', process.env.PORT || 3000);
            app.set('views', __dirname + '/views');
            app.use(app.router);
            app.set('uploads', __dirname + '/uploads');
            app.engine('html', require('ejs').renderFile);
            app.set('view engine', 'html');
            app.use(express.favicon());
            app.use(express.logger('dev'));
            app.use(express.bodyParser());
            app.use(express.methodOverride());
            app.use(express.logger({stream: expressLogFile}));
            app.use(express.cookieParser('appZiG0s3ssi0n'));
            app.use(express.session());
            app.use(require('less-middleware')({ src: __dirname + '/public' }));
            app.use(express.static(path.join(__dirname, 'public')));
            //app.use(authentication.passport.initialize());
            //app.use(authentication.passport.session());

        });

        // development only
        app.configure('development', function () {
            app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
        });

        // production only
        app.configure('production', function () {
            app.use(express.errorHandler());
        });

        app.get('/', controllers.index);

    };


    /**
     *  Start the server (starts up the application).
     */
    self.start = function () {
        http.createServer(app).listen(self.port, self.ipaddress, function () {
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

