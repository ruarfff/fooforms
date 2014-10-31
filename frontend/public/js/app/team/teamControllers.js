angular.module('team')
    .controller('TeamCtrl',
    ['$scope', '$route', '$log', 'Restangular', 'SweetAlert', 'TeamService', 'Team', 'Session', '_',
        function ($scope, $route, $log, Restangular, SweetAlert, TeamService, Team, Session, _) {
            "use strict";

            $scope.team = Session.user.teams[0];
            $scope.organisations = Session.user.organisations;
            $scope.currentOrganisation = $scope.organisations[0];

            $scope.saveTeam = function () {
                $scope.team.organisation = $scope.currentOrganisation._id;
                if ($scope.team._id){
                    TeamService.updateTeam($scope.team, function (err, team) {
                        if (err) {
                            $scope.saveTeamError = err.message;
                        } else {
                            var index = Session.user.organisations.indexOf($scope.currentOrganisation);
                            Session.user.organisations[index].teams.push(team);
                            $scope.team = Team.newTeam();
                            SweetAlert.swal('Saved!', 'Your team has been saved.', 'success');
                        }
                    });
                }else{
                    TeamService.createTeam($scope.team, function (err, team) {
                        if (err) {
                            $scope.saveTeamError = err.message;
                        } else {
                            var index = Session.user.organisations.indexOf($scope.currentOrganisation);
                            Session.user.organisations[index].teams.push(team);
                           // $scope.team = Team.newTeam();
                            SweetAlert.swal('Saved!', 'Your team has been saved.', 'success');
                        }
                    });
                }

            };

            $scope.newTeam = function () {
                $scope.team = Team.newTeam();


            };

            $scope.selectTeam = function(team){
                $scope.team = team;
            }

        }])
    .controller('TeamProfileCtrl',
    ['$scope', '$route', '$log', 'Restangular', 'TeamService', 'Team', 'Session', '_',
        function ($scope, $route, $log, Restangular, TeamService, Team, Session, _) {
            "use strict";

            $scope.team = _.find(Session.user.teams, {'displayName': $route.current.params.team});

            $scope.createTeam = function () {
                $scope.team = Team.createTeam();
                TeamService.createTeam(team, function (err, res) {

                })
            };

            $scope.saveTeam = function () {
                TeamService.createTeam($scope.team, function (err, res) {

                })
            }
        }]);
