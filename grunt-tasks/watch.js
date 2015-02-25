module.exports = function (grunt) {
    "use strict";

    grunt.config('watch', {
        options: {
            livereload: true // Default port is 35729
        },
        // No need to livereload for js and css as it will be triggered when the files are processed and added to public
        js: {
            files: ['public/js/**/*.js'],
            tasks: ['concat:js', 'uglify'],
            livereload: false
        },
        css: {
            files: ['sass/**/*.scss'],
            tasks: ['sass'],
            livereload: false
        },
        // No task here for views and public. Just livereload is run.
        views: {
            files: ['views/**', 'modules/*/views/**']
        },
        public: {
            files: ['public/css/**', 'public/js/**', 'public/template/**', 'public/partials/**']
        },
        // Watch the js files that matter on the server and run tests when they are changed.
        tests: {
            files: ['modules/**/*.js'],
            tasks: ['mochaTest'],
            livereload: false

        }
    });
    grunt.loadNpmTasks("grunt-contrib-watch");
};
