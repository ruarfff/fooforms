module.exports = function (grunt) {
    "use strict";

    grunt.config('sass', {
        dist: {
            options: {
                style: 'compressed'
            },
            files: {
                'frontend/public/site/css/fooforms.min.css': 'frontend/src/sass/fooforms.scss',
                'frontend/public/css/main.min.css': 'frontend/src/sass/main.scss',
                'frontend/public/css/signup.min.css': 'frontend/src/sass/authentication/signup.scss',
                'frontend/public/css/login.min.css': 'frontend/src/sass/authentication/login.scss'
            }
        }
    });
    grunt.loadNpmTasks("grunt-contrib-sass");
};