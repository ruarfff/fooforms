(function () {
    'use strict';

    angular
        .module('fooforms.user')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$scope', '$log', 'Restangular', '_', 'SweetAlert', 'session'];

    /* @ngInject */
    function ProfileController($scope, $log, Restangular, _, SweetAlert, session) {
        /* jshint validthis: true */
        var vm = this;

        vm.activate = activate;
        vm.title = 'ProfileController';

        $scope.update = function () {
            $scope.userProfile = Restangular.copy(session.user);

            // Remove stuff that doesn't get updated in the profile page
            delete $scope.userProfile.organisations;
            delete $scope.userProfile.teams;
            delete $scope.userProfile.folders;
            delete $scope.userProfile.defaultFolder;

            $scope.userProfile.put().then(function (data) {
                session.user.name = data.name;
                session.user.email = data.email;

                SweetAlert.swal('Updated!', 'Your profile has been saved.', 'success');
            }, function (err) {
                $log.error(err);
                SweetAlert.swal('Not Updated!', 'An error occurred trying to update your profile.', 'error');
            });
        };

        activate();

        ////////////////

        function activate() {

        }
    }

})();
