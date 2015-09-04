(function () {
    'use strict';

    angular
        .module('fooforms.team')
        .controller('TeamProfileController', TeamProfileController);

    TeamProfileController.$inject = ['$scope', '$route', '$log', '_', 'teamService', 'session'];

    /* @ngInject */
    function TeamProfileController($scope, $route, $log, _, teamService, session) {
        /* jshint validthis: true */
        var vm = this;

        vm.activate = activate;
        vm.title = 'TeamProfileController';

        $scope.createTeam = function () {
            teamService.createTeam(teamService.newTeam(), function (err, res) {
                if (err) {
                    $log.error(err);
                } else {
                    $scope.team = res.team;
                }
            })
        };

        $scope.saveTeam = function () {
            teamService.createTeam($scope.team, function (err, res) {
                if (err) {
                    $log.error(err);
                } else {
                    $scope.team = res.team;
                }
            })
        };

        activate();

        ////////////////

        function activate() {
            $scope.team = _.find(session.user.teams, {'displayName': $route.current.params.team});
        }


    }
})();
