module.exports = function (grunt) {
    "use strict";

    grunt.config('express', {


        options: {
            // Override defaults here
        },
        dev: {
            options: {
                script: 'server.js'
            }
        },
        prod: {
            options: {
                script: 'server.js',
                node_env: 'production'
            }
        },
        test: {
            options: {
                script: 'server.js',
                node_env: 'production'
            }
        }


    });
    grunt.loadNpmTasks('grunt-express-server');
};
