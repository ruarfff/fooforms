module.exports = function(grunt) {
    "use strict";


    grunt.config('mochaTest', {
        test: {
            options: {
                reporter: 'spec',
                require: 'test/coverage/blanket',
                clearRequireCache: true
            },
            src: ['modules/**/test/*-spec.js']
        },
        coverage: {
            options: {
                reporter: 'html-cov',
                quiet: true,
                //specify a destination file to capture the mocha
                //output (the quiet option does not suppress this)
                captureFile: 'frontend/public/coverage.html'
            },
            src: ['modules/**/test/*-spec.js']
        }
    });
    grunt.loadNpmTasks('grunt-mocha-test');
};
