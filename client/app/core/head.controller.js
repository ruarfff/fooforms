/**
 * Controller for the html head element. Allows the changing of head data such as style sheets.
 */
(function () {
    'use strict';
    angular
        .module('fooforms.core')
        .controller('HeadController', HeadController);

    HeadController.$inject = [];

    /* @ngInject */
    function HeadController() {
        /* jshint validthis: true */
        var vm = this;

        vm.activate = activate;
        vm.title = 'HeadController';
        vm.stylesheet = 'bootstrap';

        vm.swapStyle = function (stylesheet) {
            vm.stylesheet = stylesheet;
        };

        activate();

        ////////////////

        function activate() {
        }
    }

})();
