/*jslint node: true */
'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
    });

    grunt.loadTasks('grunt-tasks');

    grunt.loadNpmTasks("grunt-newer");

    grunt.registerTask('deploy', 'deploy pre-processed assets', ['bower', 'newer:concat:js', 'newer:concat:auth', 'newer:concat:vendor', 'newer:concat:vendorTop', 'newer:uglify', 'sass', 'newer:imagemin']);
    grunt.registerTask('preprocessing', 'deploy pre-processed assets, customised a little for nodejitsu', ['bower', 'concat:js', 'concat:auth', 'concat:vendor', 'newer:concat:vendorTop', 'uglify', 'sass', 'imagemin']);
    grunt.registerTask('default', 'start application in dev mode using watch and nodemon', ['deploy', 'mochaTest', 'concurrent']);
    grunt.registerTask('test-nowatch', 'only run tests and generate coverage report', ['deploy', 'mochaTest']);
    grunt.registerTask('test', 'only run tests and generate coverage report', ['deploy', 'mochaTest', 'watch:tests']);
    grunt.registerTask('skip-test', 'start application in dev mode using watch and nodemon', ['deploy', 'nodemon']);

};
