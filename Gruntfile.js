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
            specNameMatcher: './*.spec', // load only specs containing specNameMatcher
            projectRoot: '.',
            requirejs: false,
            forceExit: true,
            autotest: true,
            jUnit: {
                report: true,
                savePath: 'out/reports/jasmine/',
                useDotNotation: true,
                consolidate: true
            }
        }, //End bgshell test stuff
        // Minimise and append public js files
        uglify: {
            all: {
                files: {
                    'public/js/main.min.js': ['src/js/main.js']
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
                    'public/css/main.css': 'src/sass/main.scss'
                }
            }
        }, // End SASS
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
                script: 'server.js'
            }
        },
        watch: {
            all: {
                files: ['public/*'],
                tasks: ['uglify:all', 'sass'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['public/js/*'],
                tasks: ['uglify:all', 'sass'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: ['public/css/*'],
                tasks: ['sass'],
                options: {
                    livereload: true
                }
            }
        }// End watch
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
            'adduser:Brian:McAuliffe:Brian:Lee:brian@fooforms.com:secret2:true:local',
            'adduser:bob:Murphy:Bob:James:bob@gmail.com:secret3:false:local',
            'adduser:mary:Doe:Mary:Burt:mary@gmail.com:secret4:false:local',
            'addCloud:TestCloud1:A Test Cloud:none:test1:AType:Brian',
            'addCloud:TestCloud2:A Test Cloud:none:test2:AType:Brian',
            'addCloud:TestCloud3:A Test Cloud:none:test3:AType:Ruairi',
            'addCloud:TestCloud4:A Test Cloud:none:test4:AType:Ruairi'
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


    grunt.registerTask('dev', 'start application isn dev mode using watch and nodemon', ['uglify:all', 'sass', 'jasmine_node', 'concurrent']);
    grunt.registerTask('default', 'currently, default simply starts a watch on files but no other functionality', ['jasmine_node']);

};
