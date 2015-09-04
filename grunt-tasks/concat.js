module.exports = function (grunt) {
    "use strict";

    var wiredep = require('wiredep');
    var bowerFiles = wiredep({devDependencies: false})['js'];


    grunt.config('concat', {
        js: {
            options: {
                separator: ';'
            },
            src: [
                'client/app/main.js',
                'client/app/**/*.js'
            ],
            dest: 'public/js/main.min.js'
        },
        auth: {
            options: {
                separator: ';'
            },
            src: [
                'client/app/authentication/**/*.js'
            ],
            dest: 'public/js/auth.min.js'
        },
        vendor: {
            options: {
                separator: ';',
                stripBanners: true
            },
            src: bowerFiles,
            dest: 'public/js/vendor.min.js'
        },
        vendorStyle: {
            src: [
                'bower/codemirror/lib/codemirror.css',
                'bower/codemirror/theme/mdn-like.css',
                'bower/pikaday/css/pikaday.css',
                'bower/angular-busy/dist/angular-busy.min.css'
            ],
            dest: 'public/css/vendor.min.css'
        },
        site: {
            options: {
                separator: ';',
                stripBanners: true
            },
            src: [
                'bower/jquery/dist/jquery.js',
                'bower/bootstrap-sass-official/assets/javascripts/bootstrap.js'
            ],
            dest: 'public/js/site.min.js'
        },
        embeddedForm: {
            options: {
                separator: ';',
                stripBanners: true
            },
            src: [
                'bower/jquery/dist/jquery.js',
                'bower/bootstrap-sass-official/assets/javascripts/bootstrap.js',
                'bower/angular/angular.js',
                'bower/textAngular/dist/textAngular.min.js',
                'bower/textAngular/dist/textAngular-sanitize.min.js',
                'bower/textAngular/dist/textAngular-rangy.min.js',
                'bower/pikaday/pikaday.js',
                'public/js/app/common/pikadayDirective.js',
                'bower/lodash/dist/lodash.min.js',
                'public/js/app/embeddedForm/embeddedForm.js'
            ],
            dest: 'public/js/embedded-form.min.js'
        }

    });
    grunt.loadNpmTasks("grunt-contrib-concat");
};
