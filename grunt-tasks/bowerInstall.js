module.exports = function (grunt) {
    "use strict";

    grunt.config('bower', {
        install: {
            options: {
                targetDir: './frontend/src/bower',
                install: true,
                verbose: true,
                cleanTargetDir: false,
                cleanBowerDir: false,
                bowerOptions: {
                    forceLatest: true
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-bower-task');
};