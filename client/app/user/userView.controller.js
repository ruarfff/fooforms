(function () {
    'use strict';

    angular
        .module('fooforms.user')
        .controller('UserViewController', UserViewController);

    UserViewController.$inject = [];

    /* @ngInject */
    function UserViewController() {
        /* jshint validthis: true */
        var vm = this;

        vm.activate = activate;
        vm.title = 'UserViewController';

        activate();

        ////////////////

        function activate() {
        }

    }
})();
