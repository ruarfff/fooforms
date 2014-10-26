module.exports = function (grunt) {
    "use strict";

    grunt.config('sass', {
        dist: {
            options: {
                style: 'compressed'
            },
            files: {
                'frontend/public/css/fooforms.min.css': 'frontend/src/sass/site/fooforms.scss',
                'frontend/public/css/main.min.css': 'frontend/src/sass/main.scss'
            }
        }
    });
    grunt.loadNpmTasks("grunt-contrib-sass");
};
