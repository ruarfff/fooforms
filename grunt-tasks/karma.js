module.exports = function (grunt) {
    "use strict";
    grunt.config('karma', {
        unit: {
            configFile: 'karma.conf.js'
        }
    });
    grunt.loadNpmTasks('grunt-karma');
};
