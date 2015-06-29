module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
        'bower/angular/angular.js',
        'public/js/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test/frontend-out/unit.xml',
      suite: 'unit'
    }

  });
};