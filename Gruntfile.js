/*jslint node: true */
'use strict';
var path = require('path');
var async = require('async');

// WARNING! If the dev db config is changed in the main configuration it should be changed here too.
// Setting the config here was overriding the test config on CI environments
// TODO: Will try to come up with a better way to handle this
var devDbConfig = {
    "hostname": "localhost",
    "port": "27017",
    "username": "",
    "password": "",
    "name": "",
    "db": "dev"
};

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // Testing
       mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    require: 'test/coverage/blanket',
                    clearRequireCache: true
                },
                src: ['test/**/*.js']
            },
            coverage: {
                options: {
                    reporter: 'html-cov',
                    quiet: true,
                     //specify a destination file to capture the mocha
                     //output (the quiet option does not suppress this)
                    captureFile: 'frontend/public/coverage.html'
                },
                src: ['test/spec/**/*.js']
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    args: ['dev'],
                    nodeArgs: ['--debug'],
                    callback: function (nodemon) {
                        nodemon.on('log', function (event) {
                            console.log(event.colour);
                        });
                    },
                    env: {
                        PORT: '3000'
                    },
                    cwd: __dirname,
                    ignore: ['node_modules/**'],
                    ext: 'js',
                    watch: ['server'],
                    delay: 1,
                    legacyWatch: true
                }
            }
        }, // End Nodemon
        // Concatenate js files
        concat: {
            js: {
                options: {
                    separator: ';'
                },
                src: [
                    'frontend/src/js/main.js', 'frontend/src/js/common/**/*.js',
                    'frontend/src/js/app/**/*.js', 'frontend/src/js/appBuilder/**/*.js',
                    'frontend/src/js/app/**/*.js', 'frontend/src/js/appViewer/**/*.js',
                    'frontend/src/js/calendar/**/*.js', 'frontend/src/js/cloud/**/*.js',
                    'frontend/src/js/dashboard/**/*.js', 'frontend/src/js/user/**/*.js',
                    'frontend/src/js/authentication/**/*.js'
                ],
                dest: 'frontend/public/js/main-min.js'
            }
        }, // End concat
        // Minimise and append public js files
        uglify: {
            options: {
                mangle: false
            },
            js: {
                files: {
                    //'frontend/public/js/main.min.js': ['frontend/public/js/main.min.js']
                }
            }
        }, // End Uglify
        // Run SASS compiler
        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'frontend/public/css/main-min.css': 'frontend/src/sass/main.scss',
                    'frontend/public/css/signup-min.css': 'frontend/src/sass/authentication/signup.scss',
                    'frontend/public/css/login-min.css': 'frontend/src/sass/authentication/login.scss',
                    'frontend/public/css/fooforms-min.css': 'frontend/src/sass/fooforms.scss'
                }
            }
        }, // End SASS
        watch: {
            options: {
                livereload: {
                    port: 9000
                }
            },
            // No need to livereload for js and css as it will be triggered when the files are processed and added to public
            js: {
                files: ['frontend/src/js/**/*.js'],
                tasks: ['concat:js', 'uglify'],
                livereload: false
            },
            css: {
                files: ['frontend/src/sass/**/*.scss'],
                tasks: ['sass'],
                livereload: false
            },
            // No task here for views and public. Just livereload is run.
            views: {
                files: ['frontend/views/**', 'modules/*/views/**']
            },
            public: {
                files: ['frontend/public/**']
            },
            // Watch the js files that matter on the server and run tests when they are changed.
            tests: {
                files: ['modules/**/*.js', 'test/spec/**'],
                tasks: ['mochaTest']

            }
        }, // End watch
        concurrent: {
            dev: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    grunt.registerTask('dbdrop', 'drop the database', function () {
        var database = require('./modules/database')(devDbConfig);
        // async mode
        var done = this.async();

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
        process.env.NODE_ENV = process.env.NODE_ENV || 'development';
        global.config = require('./config/config')();
        grunt.task.run([
            'adduser:Ruairi:O Brien:Ruairi:Tomas:ruairi@fooforms.com:secret1:true:local',
            'adduser:Brian:McAuliffe:Brian:Lee:brian@fooforms.com:secret2:true:local',
            'adduser:bob:Murphy:Bob:James:bob@gmail.com:secret3:false:local',
            'adduser:mary:Doe:Mary:Burt:mary@gmail.com:secret4:false:local'
        ]);
    });

    grunt.registerTask('adduser', 'add a user to the database', function (displayName, familyName, givenName, middleName, emailaddress, password, admin, provider) {
       var done = this.async();
        var database = require('./modules/database')(devDbConfig);
        var userLib = require('./modules/user');
        // convert admin string to bool
        admin = (admin === "true");
        var user =
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
            };
        database.openConnection();
        console.log(user.displayName);
        console.log(user.email);

        userLib.createUser(user, function (err, user) {
            database.closeConnection();
            if (err) {
                console.log('Error: ' + err);
                done(false);
            } else if(!user) {
                console.log('Error, user was not saved and no idea why');
                done(false);
            }
            else {
                console.log('saved user: ' + user.displayName);
                done();
            }
        });

    });

    grunt.registerTask('deploy', 'deploy pre-processed assets', ['concat:js', 'uglify', 'sass']);
    grunt.registerTask('default', 'start application in dev mode using watch and nodemon', ['deploy', 'mochaTest', 'concurrent']);
    grunt.registerTask('test-watch', 'only run tests and generate coverage report', ['deploy', 'mochaTest']);
    grunt.registerTask('test', 'only run tests and generate coverage report', ['deploy', 'mochaTest', 'watch']);
    grunt.registerTask('skip-test', 'start application in dev mode using watch and nodemon', ['deploy', 'concurrent']);

};
