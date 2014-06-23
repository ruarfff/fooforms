module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'frontend/src/bower/angular/angular.js',
      'frontend/src/js/**/*.js',
      'test/spec/frontend/**/*.js'
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