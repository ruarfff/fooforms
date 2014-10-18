angular.module('team')

    .controller('TeamCtrl',
    ['$scope', '$route', '$log', 'Restangular', 'TeamService', 'Team', 'Session', '_',
        function ($scope, $route, $log, Restangular, TeamService, Team, Session, _) {
            "use strict";

            $scope.team = _.find(Session.user.teams, {'displayName': $route.current.params.team });

            $scope.createTeam = function () {
                $scope.team = Team.createTeam();
                TeamService.createTeam(team, function (err, res) {

                })
            };

            $scope.updateTeam = function () {
                TeamService.createTeam($scope.team, function (err, res) {

                })
            }
        }]);
