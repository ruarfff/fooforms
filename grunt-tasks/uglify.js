module.exports = function (grunt) {
    "use strict";

    grunt.config('uglify', {
        options: {
            mangle: false
        },
        vendor: {
            files: {
                "frontend/public/js/vendor.min.js": ["frontend/public/js/vendor.min.js"]
            }
        },
        vendorTop: {
            files: {
                "frontend/public/js/vendor-top.min.js": ["frontend/public/js/vendor-top.min.js"]
            }
        },
        site: {
            files: {
                "frontend/public/js/site.min.js": ["frontend/public/js/site.min.js"]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
};