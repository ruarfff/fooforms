/*jslint node: true */
'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
    });

    grunt.loadTasks('grunt-tasks');

    grunt.loadNpmTasks("grunt-newer");

    grunt.registerTask('deploy', 'deploy pre-processed assets', ['bower', 'newer:concat', 'newer:uglify', 'sass', 'newer:imagemin']);
    grunt.registerTask('preprocessing', 'deploy pre-processed assets, customised a little for nodejitsu', ['bower', 'concat', 'uglify', 'sass']);
    grunt.registerTask('default', 'start application in dev mode running tests and using watch', ['deploy', 'mochaTest', 'express:dev', 'watch']);
    grunt.registerTask('test', 'only run tests and generate coverage report', ['mochaTest']);
    grunt.registerTask('skip-test', 'start application in dev mode using watch and nodemon', ['deploy', 'express:dev', 'watch']);
    grunt.registerTask('brian', 'start app in dev mode only running UI tests', ['deploy']);

};
