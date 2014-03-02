/*jslint node: true */
'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
global.config = require('./config/config');

var path = require('path');
var database = require(global.config.apps.DATABASE);
var User = require(path.join(global.config.apps.USER, 'models/user')).User;
var Cloud = require(path.join(global.config.apps.CLOUD, 'models/cloud')).Cloud;

var async = require('async');

var log = require(global.config.apps.LOGGING).LOG;

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // For running stuff int he background.
        bgShell: {
            coverage: {
                cmd: 'node node_modules/istanbul/lib/cli.js cover --dir out/coverage node_modules/grunt-jasmine-node/node_modules/jasmine-node/bin/jasmine-node -- test --forceexit'
            },
            cobertura: {
                cmd: 'node node_modules/istanbul/lib/cli.js report --root out/coverage --dir out/coverage/cobertura cobertura'
            }
        },
        open: {
            file: {
                path: 'out/coverage/lcov-report/index.html'
            }
        },
        jasmine_node: {
            jasmine_node: {
                specNameMatcher: "./test/spec", // load only specs containing specNameMatcher
                projectRoot: ".",
                requirejs: false,
                forceExit: true,
                jUnit: {
                    report: false,
                    savePath: "./out/reports/jasmine/",
                    useDotNotation: true,
                    consolidate: true
                }
            }
        },
        concurrent: {
            dev: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
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
                    'frontend/src/js/calendar/**/*.js', 'frontend/src/js/cloud/**/*.js',
                    'frontend/src/js/dashboard/**/*.js', 'frontend/src/js/user/**/*.js'
                ],
                dest: 'frontend/public/js/main.min.js'
            }
        }, // End concat
        // Minimise and append public js files
        uglify: {
            options: {
                mangle: false
            },
            js: {
                files: {
                    'frontend/public/js/main.min.js': ['frontend/public/js/main.min.js']
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
                    'frontend/public/css/main.css': 'frontend/src/sass/main.scss'
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
                files: ['frontend/views/**', 'apps/*/views/**']
            },
            public: {
                files: ['frontend/public/**']
            },
            // Watch the js files that matter on the server and run tests when they are changed.
            tests: {
                files: ['apps/**/*.js', 'test/spec/**'],
                tasks: ['jasmine_node']

            }
        } // End watch
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
            'adduser:Brian:McAuliffe:Brian:Lee:brian@fooforms.com:secret2:true:local',
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

        var allDone = this.async();
        var done = this.async();
        log.debug('Adding cloud: ' + name + ' - ' + description + ' - ' + icon + ' - ' + menuLabel + ' - ' + type + ' - ' + owner);

        if (owner) {
            log.debug('startng');

            log.debug('Found one');

            var cloud = new Cloud(
                {
                    name: name,
                    description: description,
                    icon: icon,
                    menuLabel: menuLabel
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

        } else {
            log.error('owner cannot be Null');
        }
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


    grunt.registerTask('default', 'start application in dev mode using watch and nodemon', ['concat:js', 'uglify', 'sass', 'jasmine_node', 'concurrent']);

};
