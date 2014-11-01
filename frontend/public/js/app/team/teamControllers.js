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
                $scope.orgMembers = [];
                TeamService.getMembers($scope.currentTeam, function (err, members) {
                    $scope.members = members;

                    for(var i = 0; i < $scope.members.length; i++) {
                        // This is to allow Restangular do put & remove on these objects.
                        $scope.members[i].self = {};
                        $scope.members[i].self.link = '/api/users/' + $scope.members[i]._id;
                    }

                    // Only show users that are not in the current team, in the org team list
                    $scope.orgMembers = _.filter(Session.org.members, function(member) {
                        var found = !!_.find($scope.members, { _id: member._id });

                        return !found;
                    });
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
            };
/**
            $scope.removeFromTeam = function (member) {
                _.pull(member.teams, $scope.currentTeam);
                _.pull($scope.currentTeam.members, member);

                TeamService.updateTeam($scope.currentTeam, function (err, next) {
                    if(err) {
                        alert(err);
                    }
                    else {
                        member.put().then(function (data) {
                            Session.user = _.extend(Session.user, _(data).pick(_(Session.user).keys()));

                            _.pull($scope.members, member);
                            $scope.orgMembers.push(member);

                        }, function (err) {
                            console.log("There was an error saving");
                            alert(err);
                        });
                    }

                });
            };

            $scope.addToTeam = function (member) {
                member.teams.push($scope.currentTeam);
                $scope.currentTeam.members.push(member);

                TeamService.updateTeam($scope.currentTeam, function (err, next) {
                    if(err) {
                        alert(err);
                    }
                    else {
                        var teamIds = [];

                        for(var i = 0; i < member.teams.length; i++) {
                            var team = member.teams[i];
                            if(team) {
                                if(team._id) {
                                    team = team._id;
                                }
                                teamIds.push(team);
                            }

                        }
                        member.teams = teamIds;
                        member.put().then(function (data) {
                            Session.user = _.extend(Session.user, _(data).pick(_(Session.user).keys()));

                            _.pull($scope.orgMembers, member);
                            $scope.members.push(member);


                        }, function (err) {
                            console.log("There was an error saving");
                            alert(err);
                        });
                    }

                })
            };*/

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
