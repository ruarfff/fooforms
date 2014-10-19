module.exports = function (grunt) {
    "use strict";

    grunt.config('concat', {
        js: {
            options: {
                separator: ';',
                stripBanners: true
            },
            src: [
                'frontend/public/js/app/**/*.js'
            ],
            dest: 'frontend/public/js/main.min.js'
        },
        auth: {
            options: {
                separator: ';'
            },
            src: [
                'frontend/public/js/app/authentication/**/*.js'
            ],
            dest: 'frontend/public/js/auth.min.js'
        },
        vendorTop: {
            js: {

            },
            src: [
                'frontend/src/bower/angular/angular.min.js',
                'frontend/src/bower/angular-route/angular-route.min.js',
                'frontend/src/bower/angular-cookies/angular-cookies.min.js'
            ],
            dest: 'frontend/public/js/vendor-top.min.js'
        },
        // Vendor JS to be included just before body end
        vendor: {
            options: {
                separator: ';'
            },
            src: [
                'frontend/src/bower/jquery-ui/ui/minified/jquery-ui.min.js',
                'frontend/src/bower/angular-bootstrap/ui-bootstrap.min.js',
                'frontend/src/bower/angular-bootstrap/ui-bootstrap-tpls.min.js',
                'frontend/src/bower/lodash/dist/lodash.min.js',
                'frontend/src/bower/restangular/dist/restangular.min.js',
                'frontend/src/bower/angular-route/angular-route.min.js',
                'frontend/src/bower/angular-sanitize/angular-sanitize.min.js',
                'frontend/src/bower/ng-grid/build/ng-grid.min.js',
                'frontend/src/bower/textAngular/dist/textAngular.min.js',
                'frontend/src/bower/ngInfiniteScroll/build/ng-infinite-scroll.min.js',
                'frontend/src/bower/moment/min/moment.min.js',
                'frontend/src/bower/fullcalendar/dist/fullcalendar.min.js',
                'frontend/src/bower/angular-ui-codemirror/dist/ui-codemirror.min.js',
                'frontend/src/bower/codemirror/lib/codemirror.js',
                'frontend/src/bower/sweetalert/lib/sweet-alert.min.js'
            ],
            dest: 'frontend/public/js/vendor.min.js'
        }
    });
    grunt.loadNpmTasks("grunt-contrib-concat");
};
