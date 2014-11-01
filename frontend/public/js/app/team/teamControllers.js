angular.module('team')
    .controller('TeamCtrl',
    ['$scope', '$route', '$log', 'Restangular', 'SweetAlert', 'TeamService', 'Team', 'Session', '_',
        function ($scope, $route, $log, Restangular, SweetAlert, TeamService, Team, Session, _) {
            "use strict";

            $scope.currentTeam = Session.user.teams[0];
            $scope.currentOrganisation = Session.user.organisations[0];

            var setTeam = function (team) {
                $scope.currentTeam = team;
                $scope.members = [];
                TeamService.getMembers($scope.currentTeam, function (err, members) {
                    $scope.members = members;
                });
            };

            // Initialize team
            setTeam($scope.currentTeam);


            $scope.saveTeam = function () {
                if ($scope.currentTeam._id){
                    TeamService.updateTeam($scope.currentTeam, function (err, team) {
                        if (err) {
                            $scope.saveTeamError = err.message;
                        } else {
                            var index = Session.user.organisations.indexOf($scope.currentOrganisation);
                            var teamIndex = Session.user.organisations[index].teams.indexOf(team);
                            Session.user.organisations[index].teams[teamIndex] = team;
                            SweetAlert.swal('Saved!', 'Your team has been updated.', 'success');
                        }
                    });
                }else{
                    $scope.currentTeam.organisation = $scope.currentOrganisation._id;
                    TeamService.createTeam($scope.currentTeam, function (err, team) {
                        if (err) {
                            $scope.saveTeamError = err.message;
                        } else {
                            var index = Session.user.organisations.indexOf($scope.currentOrganisation);
                            Session.user.organisations[index].teams.push(team);
                            $scope.currentTeam = Team.newTeam();
                            SweetAlert.swal('Saved!', 'Your team has been saved.', 'success');
                        }
                    });
                }

            };

            $scope.newTeam = function () {
                $scope.currentTeam = Team.newTeam();
            };

            $scope.selectTeam = function(team){
                setTeam(team);
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
