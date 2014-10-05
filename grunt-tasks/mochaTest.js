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
        }
    });
    grunt.loadNpmTasks('grunt-mocha-test');
};
