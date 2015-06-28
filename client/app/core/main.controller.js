(function () {
    'use strict';

    angular
        .module('fooforms.core')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', 'session'];

    /* @ngInject */
    function MainController($scope, session) {
        /* jshint validthis: true */
        var vm = this;

        vm.activate = activate;
        vm.title = 'MainController';

        $scope.setMessage = function (msgBox, status, title, message) {
            $scope.activeMsgBox = msgBox;
            $scope.msgStatus = status;
            $scope.msgTitle = title;
            $scope.msg = message;
        };

        activate();

        ////////////////

        function activate() {
            $scope.sideMenuVisible = true;

            //Messaging throughout App
            $scope.activeMsgBox = ''; // any string --matches ng-show of various msgboxes.
            $scope.msgStatus = ''; // used in class, so alert-danger, etc...
            $scope.msgTitle = ''; // optional -
            $scope.msg = ''; // optional, but pretty stupid not to populate it

            $scope.$watch(function () {
                return session.user
            }, function (newVal) {
                if (typeof newVal !== 'undefined') {
                    $scope.user = session.user;
                }
            });
            $scope.$watch(function () {
                return session.org
            }, function (newVal) {
                if (typeof newVal !== 'undefined') {
                    $scope.org = session.org;
                }
            });
        }

    }

})();
