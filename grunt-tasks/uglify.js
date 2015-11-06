module.exports = function (grunt) {
    "use strict";

    grunt.config('uglify', {
        options: {
            mangle: false
        },
        vendor: {
            files: {
                "public/js/vendor.min.js": ["public/js/vendor.min.js"]
            }
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
    grunt.loadNpmTasks('grunt-contrib-uglify');
};
