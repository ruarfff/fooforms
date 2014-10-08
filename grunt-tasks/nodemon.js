module.exports = function (grunt) {
    "use strict";

    grunt.config('nodemon', {
        dev: {
            script: 'server.js',
            options: {
                callback: function (nodemon) {
                    nodemon.on('log', function (event) {
                        console.log(event.colour);
                    });
                },
                env: {
                    PORT: 3000
                },
                cwd: './',
                ignore: ['node_modules/**', 'frontend/**', 'logs/**', 'test/**'],
                ext: 'js',
                watch: ['server'],
                delay: 1,
                legacyWatch: true
            }
        }
    });
    grunt.loadNpmTasks('grunt-nodemon');
};
