module.exports = function (grunt) {
    "use strict";

    grunt.config('sass', {
        dist: {
            options: {
                style: 'compressed'
            },
            files: {
                'public/css/fooforms.min.css': 'sass/site/fooforms.scss',
                'public/css/main.min.css': 'sass/main.scss',
                'public/css/embedded-form.min.css': 'sass/embedded-form/embedded-form.scss'
            }
        }
    });
    grunt.loadNpmTasks("grunt-contrib-sass");
};
