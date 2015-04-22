module.exports = function (grunt) {
    "use strict";

    grunt.config('env', {
        options: {
            //Shared Options Hash
        },
        dev: {
            NODE_ENV: 'development'
        },
        test: {
            NODE_ENV: 'test'
        },
        prod: {
            NODE_ENV: 'production'
        }
    });
    grunt.loadNpmTasks("grunt-env");
};