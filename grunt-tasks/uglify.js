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
        vendorTop: {
            files: {
                "public/js/vendor-top.min.js": ["public/js/vendor-top.min.js"]
            }
        },
        site: {
            files: {
                "public/js/site.min.js": ["public/js/site.min.js"]
            }
        },
        embeddedForm: {
            files: {
                "public/js/embedded-form.min.js": ["public/js/embedded-form.min.js"]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
};