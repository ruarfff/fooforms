module.exports = function (grunt) {
    "use strict";

    grunt.config('uglify', {
        options: {
            mangle: false
        },
        js: {
            files: {
                'frontend/public/js/vendor.min.js': ['frontend/public/js/vendor.min.js']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
};