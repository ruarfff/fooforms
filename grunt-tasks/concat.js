module.exports = function (grunt) {
    "use strict";

    grunt.config('concat', {
        js: {
            options: {
                separator: ';'
            },
            src: [
                'frontend/public/js/app/main.js',
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
            options: {
                separator: ';',
                stripBanners: true
            },
            src: [
                'frontend/src/bower/jquery/dist/jquery.js',
                'frontend/src/bower/bootstrap-sass-official/assets/javascripts/bootstrap.js',
                'frontend/src/bower/angular/angular.js'
            ],
            dest: 'frontend/public/js/vendor-top.min.js'
        },
        // Vendor JS to be included just before body end
        vendor: {
            options: {
                separator: ';',
                stripBanners: true
            },
            src: [
                'frontend/src/bower/angular-route/angular-route.min.js',
                'frontend/src/bower/angular-cookies/angular-cookies.min.js',
                'frontend/src/bower/trNgGrid/release/trNgGrid.min.js',
                'frontend/src/bower/jquery-ui/ui/minified/jquery-ui.min.js',
                'frontend/src/bower/angular-bootstrap/ui-bootstrap.min.js',
                'frontend/src/bower/angular-bootstrap/ui-bootstrap-tpls.min.js',
                'frontend/src/bower/lodash/dist/lodash.min.js',
                'frontend/src/bower/restangular/dist/restangular.min.js',
                'frontend/src/bower/angular-route/angular-route.min.js',
                'frontend/src/bower/angular-sanitize/angular-sanitize.min.js',
                'frontend/src/bower/textAngular/dist/textAngular.min.js',
                'frontend/src/bower/ngInfiniteScroll/build/ng-infinite-scroll.min.js',
                'frontend/src/bower/moment/min/moment.min.js',
                'frontend/src/bower/fullcalendar/dist/fullcalendar.min.js',
                'frontend/src/bower/angular-ui-codemirror/ui-codemirror.min.js',
                'frontend/src/bower/codemirror/lib/codemirror.js',
                'frontend/src/bower/pikaday/pikaday.js',
                'frontend/src/bower/sweetalert/lib/sweet-alert.min.js',
                'frontend/src/bower/angular-sweetalert/SweetAlert.min.js',
                'frontend/src/bower/angular-busy/dist/angular-busy.min.js'
            ],
            dest: 'frontend/public/js/vendor.min.js'
        },
        vendorStyle: {
            src: [
                'frontend/src/bower/codemirror/lib/codemirror.css',
                'frontend/src/bower/codemirror/theme/mdn-like.css',
                'frontend/src/bower/pikaday/css/pikaday.css',
                'frontend/src/bower/angular-busy/dist/angular-busy.min.css'
            ],
            dest: 'frontend/public/css/vendor.min.css'
        },
        site: {
            options: {
                separator: ';',
                stripBanners: true
            },
            src: [
                'frontend/src/bower/jquery/dist/jquery.js',
                'frontend/src/bower/bootstrap-sass-official/assets/javascripts/bootstrap.js'
            ],
            dest: 'frontend/public/js/site.min.js'
        },
        embeddedForm: {
            options: {
                separator: ';',
                stripBanners: true
            },
            src: [
                'frontend/src/bower/jquery/dist/jquery.js',
                'frontend/src/bower/bootstrap-sass-official/assets/javascripts/bootstrap.js',
                'frontend/src/bower/angular/angular.js',
                'frontend/src/bower/angular-sanitize/angular-sanitize.min.js',
                'frontend/src/bower/textAngular/dist/textAngular.min.js',
                'frontend/src/bower/pikaday/pikaday.js',
                'frontend/public/js/app/common/pikadayDirective.js',
                'frontend/public/js/app/embeddedForm/embeddedForm.js'
            ],
            dest: 'frontend/public/js/embedded-form.min.js'
        }

    });
    grunt.loadNpmTasks("grunt-contrib-concat");
};
