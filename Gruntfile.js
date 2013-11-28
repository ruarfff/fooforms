/*jslint node: true */
'use strict';

var User = require('./apps/user/models/user');
var database = require('./apps/database/lib');

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: require('./package.json'),
        nodemon: {
            dev: {
                options: {
                    file: 'server.js',
                    watchedExtensions: ['js', 'json'],
                    ignoredFiles: ['node_modules/**', 'public/**'],
                    nodeArgs: ['--debug']
                }
            }
        },
        concurrent: {
            target: {
                tasks: ['nodemon'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }

    });

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
};