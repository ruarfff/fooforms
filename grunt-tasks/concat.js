module.exports = function (grunt) {
    "use strict";

    grunt.config('concat', {
        js: {
            options: {
                separator: ';',
                stripBanners: true
            },
            src: [
                'frontend/src/js/main.js',
                'frontend/src/js/common/**/*.js',
                'frontend/src/js/form/**/*.js',
                'frontend/src/js/formBuilder/**/*.js',
                'frontend/src/js/formViewer/**/*.js',
                'frontend/src/js/calendar/**/*.js',
                'frontend/src/js/folder/**/*.js',
                'frontend/src/js/dashboard/**/*.js',
                'frontend/src/js/user/**/*.js',
                'frontend/src/js/authentication/**/*.js'
            ],
            dest: 'frontend/public/js/main.min.js'
        },
        auth: {
            options: {
                separator: ';'
            },
            src: [
                'frontend/src/js/authentication/**/*.js'
            ],
            dest: 'frontend/public/js/auth.min.js'
        },
        // Vendor JS to be included just before body end
        vendor: {
            options: {
                separator: ';'
            },
            src: [
                'frontend/src/bower/jquery-ui/ui/minified/jquery-ui.min.js',
                'frontend/src/bower/angular-bootstrap/ui-bootstrap.min.js',
                'frontend/src/bower/lodash/dist/lodash.min.js',
                'frontend/src/bower/restangular/dist/restangular.min.js',
                'frontend/src/bower/angular-route/angular-route.min.js',
                'frontend/src/bower/angular-sanitize/angular-sanitize.min.js',
                'frontend/src/bower/ng-grid/build/ng-grid.min.js',
                'frontend/src/bower/textAngular/dist/textAngular.min.js',
                'frontend/src/bower/angular-cookies/angular-cookies.min.js',
                'frontend/src/bower/moment/min/moment.min.js',
                'frontend/src/bower/fullcalendar/dist/fullcalendar.min.js'
            ],
            dest: 'frontend/public/js/vendor.min.js'
        }
    });
    grunt.loadNpmTasks("grunt-contrib-concat");
};