(function () {
    'use strict';

    angular
        .module('fooforms.user')
        .controller('PeopleController', PeopleController);

    PeopleController.$inject = ['$scope', '$http'];

    /* @ngInject */
    function PeopleController($scope, $http) {
        /* jshint validthis: true */
        var vm = this;

        vm.activate = activate;
        vm.title = 'PeopleController';


        $scope.getUsers = function (val) {
            $scope.loadingUsers = true;
            return $http.get('/api/users', {
                params: {
                    username: val
                }
            }).then(function (res) {
                $scope.loadingUsers = false;
                var users = [];
                angular.forEach(res.data, function (item) {
                    users.push(item.displayName);
                });
                return users;
            });
        };

        activate();

        ////////////////

        function activate() {
            $scope.selectedUser = '';
        }

    }

})();
