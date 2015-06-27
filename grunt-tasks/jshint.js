module.exports = function (grunt) {
    "use strict";

    grunt.config('jshint', {
        options: {
            reporter: require('jshint-stylish'),
            jshintrc: true
        },
        all: ['Gruntfile.js', 'config/**/*.js', 'grunt-tasks/**/*.js', 'modules/**/*.js', 'client/app/**/*.js']
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
};
