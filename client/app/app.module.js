(function () {
    'use strict';
    angular.module('fooforms', [
        //TODO: figure out what's used where
        'ngRoute', 'ngSanitize', 'trNgGrid', 'restangular', 'ui.bootstrap', 'textAngular', 'ui.calendar', 'angularFileUpload', 'ui.sortable', 'infinite-scroll', 'oitozero.ngSweetAlert', 'cgBusy', 'ui.codemirror',
        'fooforms.core',
        'fooforms.authentication',
        'fooforms.dashboard',
        'fooforms.form',
        'fooforms.formBuilder',
        'fooforms.formViewer',
        'fooforms.user',
        'fooforms.organisation',
        'fooforms.team',
        'fooforms.post',
        'fooforms.comment',
        'fooforms.invite',
        'fooforms.store'
    ]);
})();

