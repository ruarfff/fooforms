/*jslint node: true */
'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var database = require('./apps/database/lib');
var User = require('./apps/user/models/user').User;

module.exports = function (grunt) {


    /**


     grunt.loadNpmTasks('grunt-nodemon');

     grunt.registerTask('dbseed', 'seed the database', function () {
        grunt.task.run('adduser:admin:admin@example.com:secret:true');
     grunt.task.run('adduser:bob:bob@example.com:secret:false');
     });

     grunt.registerTask('adduser', 'add a user to the database', function (usr, emailaddress, pass, adm) {
        // convert adm string to bool
        adm = (adm === "true");

        var user = new User(
            {
                username: usr,
                email: emailaddress,
                password: pass,
                admin: adm
            }
        );

        // save call is async, put grunt into async mode to work
        var done = this.async();

        user.save(function (err) {
            if (err) {
                console.log('Error: ' + err);
                done(false);
            } else {
                console.log('saved user: ' + user.username);
                done();
            }
        });
    });

     grunt.registerTask('dbdrop', 'drop the database', function () {
        // async mode
        var done = this.async();

        database.connection.on('open', function () {
            database.connection.db.dropDatabase(function (err) {
                if (err) {
                    console.log('Error: ' + err);
                    done(false);
                } else {
                    console.log('Successfully dropped db');
                    done();
                }
            });
        });
    });
     grunt.registerTask('start', ['concurrent', function(){
        grunt.task.run('dbseed');
    }]);

     **/


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
                    console.log('Error: ' + err);
                    done(false);
                } else {
                    console.log('Successfully dropped db');
                    done();
                }
            });
        });
        database.openConnection();
    });

    grunt.registerTask('dbseed', 'seed the database', function () {
        grunt.task.run([
            'adduser:ruairi:ruairi@fooforms.com:secret1:true',
            'adduser:brian:brian@fooforms.com:secret2:true',
            'adduser:bob:bob@gmail.com:secret3:false',
            'adduser:mary:mary@gmail.com:secret4:false'
        ]);
    });

    grunt.registerTask('adduser', 'add a user to the database', function (usr, emailaddress, pass, adm) {
        var done = this.async();
        // convert adm string to bool
        adm = (adm === "true");
        var user = new User(
            {
                username: usr,
                email: emailaddress,
                password: pass,
                admin: adm
            }
        );
        database.openConnection();
        console.log(user.username);
        console.log(user.email);

        user.save(function (err) {
            database.closeConnection();
            if (err) {
                console.log('Error: ' + err);
                done(false);
            } else {
                console.log('saved user: ' + user.username);
                done();
            }
        });

    });


    grunt.registerTask('dev', ['concurrent:dev']);
    grunt.registerTask('default', ['watch']);

};