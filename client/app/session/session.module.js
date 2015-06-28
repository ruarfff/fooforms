(function () {
    'use strict';

    angular
        .module('fooforms.session', [
            'ngRoute',
            'fooforms.session',
            'fooforms.authentication',
            'fooforms.organisation',
            'fooforms.dashboard'
        ]);
})();
