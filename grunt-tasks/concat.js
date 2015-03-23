module.exports = function (grunt) {
    "use strict";

    grunt.config('concat', {
        js: {
            options: {
                separator: ';'
            },
            src: [
                'public/js/app/main.js',
                'public/js/app/**/*.js'
            ],
            dest: 'public/js/main.min.js'
        },
        auth: {
            options: {
                separator: ';'
            },
            src: [
                'public/js/app/authentication/**/*.js'
            ],
            dest: 'public/js/auth.min.js'
        },
        vendorTop: {
            options: {
                separator: ';',
                stripBanners: true
            },
            src: [
                'bower/jquery/dist/jquery.js',
                'bower/bootstrap-sass-official/assets/javascripts/bootstrap.js',
                'bower/angular/angular.js'
            ],
            dest: 'public/js/vendor-top.min.js'
        },
        // Vendor JS to be included just before body end
        vendor: {
            options: {
                separator: ';',
                stripBanners: true
            },
            src: [
                'bower/angular-route/angular-route.min.js',
                'bower/angular-cookies/angular-cookies.min.js',
                'bower/trNgGrid/trNgGrid.min.js',
                'bower/jquery-ui/jquery-ui.min.js',
                'bower/angular-bootstrap/ui-bootstrap.min.js',
                'bower/angular-bootstrap/ui-bootstrap-tpls.min.js',
                'bower/lodash/dist/lodash.min.js',
                'bower/restangular/dist/restangular.min.js',
                'bower/angular-route/angular-route.min.js',
                'bower/angular-sanitize/angular-sanitize.min.js',
                'bower/textAngular/dist/textAngular.min.js',
                'bower/textAngular/dist/textAngular-sanitize.min.js',
                'bower/textAngular/dist/textAngular-rangy.min.js',
                'bower/ngInfiniteScroll/build/ng-infinite-scroll.min.js',
                'bower/moment/min/moment.min.js',
                'bower/fullcalendar/dist/fullcalendar.min.js',
                'bower/codemirror/lib/codemirror.js',
                'bower/codemirror/mode/css/css.js',
                'bower/codemirror/mode/javascript/javascript.js',
                'bower/codemirror/mode/xml/xml.js',
                'bower/codemirror/mode/htmlmixed/htmlmixed.js',
                'bower/angular-ui-codemirror/ui-codemirror.min.js',
                'bower/pikaday/pikaday.js',
                'bower/sweetalert/lib/sweet-alert.min.js',
                'bower/angular-sweetalert/SweetAlert.min.js',
                'bower/angular-busy/dist/angular-busy.min.js',
                'bower/angular-ui-sortable/sortable.min.js'
            ],
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
                'public/js/app/embeddedForm/embeddedForm.js'
            ],
            dest: 'public/js/embedded-form.min.js'
        }

    });
    grunt.loadNpmTasks("grunt-contrib-concat");
};
