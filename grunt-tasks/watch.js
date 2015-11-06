module.exports = function (grunt) {
    "use strict";

    grunt.config('watch', {
        options: {
            livereload: true // Default port is 35729
        },
        css: {
            files: ['sass/**/*.scss'],
            tasks: ['sass'],
            livereload: false
        },
        js: {
            files: ['client/app/**/*.js'],
            tasks: ['process-frontend-js']
        },
        // No task here for views and public. Just livereload is run.
        views: {
            files: ['views/**', 'modules/*/views/**']
        },
        public: {
            files: ['public/css/**', 'public/template/**', 'public/partials/**']
        },
        // Watch the js files that matter on the server and run tests when they are changed.
        tests: {
            files: ['modules/**/*.js'],
            tasks: ['mochaTest'],
            livereload: false

        },
        express: {
            files: ['server.js', 'config/**/*.js', 'modules/**/*.js', 'routes/**/*.js', '!modules/*/test/**'],
            tasks: ['express:dev'],
            options: {
                spawn: false
            },
            livereload: false
        }
    });
    grunt.loadNpmTasks("grunt-contrib-watch");
};
