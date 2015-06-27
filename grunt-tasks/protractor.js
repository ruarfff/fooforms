module.exports = function(grunt) {
    "use strict";

    grunt.config('protractor', {
        options: {
            configFile: "node_modules/protractor/referenceConf.js", // Default config file
            keepAlive: true, // If false, the grunt process stops when the test fails.
            noColor: false, // If true, protractor will not use colors in its output.
            args: {
                // Arguments passed to the command
            }
        },
        run: {
            options: {
                configFile: "protractor.conf.js", // Target-specific config file
                args: {} // Target-specific arguments
            }
        }
    });
    grunt.loadNpmTasks('grunt-protractor-runner');
};
