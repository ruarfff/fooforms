module.exports = function (grunt) {
    "use strict";

    grunt.config('ngAnnotate', {
        options: {
            singleQuotes: true
        },
        site: {
            files: {
                "public/js/site.min.js": ["public/js/site.min.js"]
            }
        },
        embeddedForm: {
            files: {
                "client/app/embedded-form.min.js": ["public/js/embedded-form.min.js"]
            }
        }
    });
    grunt.loadNpmTasks('grunt-ng-annotate');
};
