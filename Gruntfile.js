/*jslint node: true */
'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
global.config = require('./config/config');

var path = require('path');
var database = require(global.config.apps.DATABASE);
var User = require(path.join(global.config.apps.USER, 'models/user')).User;

var log = require(global.config.apps.LOGGING).LOG;

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        nodemon: {
            // For development. Nodemon keeps the app running and loads file changes automatically.
            dev: {
                options: {
                    file: 'server.js',
                    watchedExtensions: ['js', 'json'],
                    ignoredFiles: ['node_modules/**', 'public/**'],
                    nodeArgs: ['--debug']
                }
            }
        },// End nodemon
        watch: {
            // Run certain tasks every time a js file changes.
            all: {
                files: '**/*.js',
                tasks: [
                    ['mochaTest']
                ]
            }
        },// End watch
        concurrent: {
            // Spawn separate processes for nodemon and watch
            dev: {
                options: {
                    logConcurrentOutput: true
                },
                tasks: ['watch', 'nodemon:dev']
            }
        },// End concurrent
        // Configure a mochaTest task
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    require: 'coverage/blanket',
                    clearRequireCache: true
                },
                src: ['test/**/*.js']
            },
            coverage: {
                options: {
                    reporter: 'html-cov',
                    // use the quiet flag to suppress the mocha console output
                    quiet: true,
                    // specify a destination file to capture the mocha
                    // output (the quiet option does not suppress this)
                    captureFile: 'public/coverage.html'
                },
                src: ['test/**/*.js']
            },
            watch: {
                js: {
                    options: {
                        spawn: false
                    },
                    files: '**/*.js',
                    tasks: ['check']
                }
            }
        }// End mochaTest
    });

    // On watch events configure mochaTest to run only on the test if it is one
    // otherwise, run the whole testsuite
    var defaultSimpleSrc = grunt.config('mochaTest.simple.src');
    grunt.event.on('watch', function (action, filepath) {
        grunt.config('mochaTest.simple.src', defaultSimpleSrc);
        if (filepath.match('test/')) {
            grunt.config('mochaTest.simple.src', filepath);
        }
    });


    grunt.registerTask('dbdrop', 'drop the database', function () {
        // async mode
        var done = this.async();

        //  var database = require('./apps/database/lib');

        database.connection.on('open', function () {
            database.connection.db.dropDatabase(function (err) {
                database.closeConnection();
                if (err) {
                    log.error('Error: ' + err);
                    done(false);
                } else {
                    log.debug('Successfully dropped db');
                    done();
                }
            });
        });
        database.openConnection();
    });

    grunt.registerTask('dbseed', 'seed the database', function () {
        grunt.task.run([
            'adduser:Ruairi:O Brien:Ruairi:Tomas:ruairi@fooforms.com:secret1:true:local',
            'adduser:Brian:McAuliffe::brian@fooforms.com:secret2:true:local',
            'adduser:bob:Murphy:Bob:James:bob@gmail.com:secret3:false:local',
            'adduser:mary:Doe:Mary:Burt:mary@gmail.com:secret4:false:local'
        ]);
    });

    grunt.registerTask('adduser', 'add a user to the database', function (displayName, familyName, givenName, middleName, emailaddress, password, admin, provider) {
        var done = this.async();
        // convert adm string to bool
        admin = (admin === "true");
        var user = new User(
            {
                displayName: displayName,
                name: {
                    familyName: familyName,
                    givenName: givenName,
                    middleName: middleName
                },
                email: emailaddress,
                password: password,
                admin: admin,
                provider: provider
            }
        );
        database.openConnection();
        log.debug(user.displayName);
        log.debug(user.email);

        user.save(function (err) {
            database.closeConnection();
            if (err) {
                log.error('Error: ' + err);
                done(false);
            } else {
                log.debug('saved user: ' + user.displayName);
                done();
            }
        });

    });

    grunt.registerTask('addCloud', 'add a cloud to the database', function (name, description, icon, menuLabel, type, owner) {

        var done = this.async();
        var cloud = new Cloud(
            {
                name: name,
                description: description,
                icon: icon,
                menuLabel: menuLabel,
                owner: owner
            }
        );
        database.openConnection();
        log.debug(cloud.name);

        cloud.save(function (err) {
            database.closeConnection();
            if (err) {
                log.error('Error: ' + err);
                done(false);
            } else {
                log.debug('saved cloud: ' + cloud.name);
                done();
            }
        });

    });

    grunt.registerTask('addApp', 'add an app to the database', function (name, description, icon, menuLabel, type, owner) {

        var done = this.async();
        var app = new App(
            {
                name: name,
                description: description,
                icon: icon,
                menuLabel: menuLabel,
                owner: owner
            }
        );
        database.openConnection();
        log.debug(app.name);

        app.save(function (err) {
            database.closeConnection();
            if (err) {
                log.error('Error: ' + err);
                done(false);
            } else {
                log.debug('saved app: ' + app.name);
                done();
            }
        });

    });


    grunt.registerTask('dev', ['concurrent:dev']);
    grunt.registerTask('default', ['watch']);

};
