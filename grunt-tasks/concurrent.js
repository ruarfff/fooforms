module.exports = function (grunt) {
    "use strict";

    grunt.config('concurrent', {
        dev: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        }
    });
    grunt.loadNpmTasks("grunt-concurrent");
};