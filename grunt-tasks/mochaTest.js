module.exports = function (grunt) {
    "use strict";


    grunt.config('mochaTest', {
        test: {
            options: {
                reporter: 'spec',
                clearRequireCache: true
            },
            src: ['modules/**/test/*-spec.js']
        }
    });
    grunt.loadNpmTasks('grunt-mocha-test');
};
