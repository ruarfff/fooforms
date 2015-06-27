module.exports = function (config) {
    config.set({

        basePath: './',

        files: [
            'bower/angular/angular.js',
            'bower/bardjs/dist/bard.js',
            'public/js/**/*.js'
        ],

        autoWatch: true,

        frameworks: ['jasmine', 'sinon'],

        browsers: ['Chrome'],

        plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
        ],

        junitReporter: {
            outputFile: 'tests/frontend-out/unit.xml',
            suite: 'unit'
        }

    });
};