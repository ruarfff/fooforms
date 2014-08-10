module.exports = function(grunt) {
    "use strict";


    grunt.config('mochaTest', {
        test: {
            options: {
                reporter: 'spec',
                require: 'test/coverage/blanket',
                clearRequireCache: true
            },
            src: ['test/spec/modules/**/*.js']
        },
        coverage: {
            options: {
                reporter: 'html-cov',
                quiet: true,
                //specify a destination file to capture the mocha
                //output (the quiet option does not suppress this)
                captureFile: 'frontend/public/coverage.html'
            },
            src: ['test/spec/modules/**/*.js']
        }
    });
    grunt.loadNpmTasks('grunt-mocha-test');
};