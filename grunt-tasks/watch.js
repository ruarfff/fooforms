module.exports = function (grunt) {
    "use strict";

    grunt.config('watch', {
        options: {
            livereload: {
                port: 9000
            }
        },
        // No need to livereload for js and css as it will be triggered when the files are processed and added to public
        js: {
            files: ['frontend/src/js/**/*.js'],
            tasks: ['concat:js', 'uglify'],
            livereload: false
        },
        css: {
            files: ['frontend/src/sass/**/*.scss'],
            tasks: ['sass'],
            livereload: false
        },
        // No task here for views and public. Just livereload is run.
        views: {
            files: ['frontend/views/**', 'modules/*/views/**']
        },
        public: {
            files: ['frontend/public/css/**', 'frontend/public/js/**', 'frontend/public/template/**', 'frontend/public/partials/**']
        },
        // Watch the js files that matter on the server and run tests when they are changed.
        tests: {
            files: ['modules/**/*.js', 'test/spec/modules/**'],
            tasks: ['mochaTest']

        }
    });
    grunt.loadNpmTasks("grunt-contrib-watch");
};