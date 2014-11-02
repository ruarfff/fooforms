angular.module('team')
    .controller('TeamCtrl',
    ['$scope', '$route', '$log', 'Restangular', 'SweetAlert', 'TeamService', 'Team', 'Session', '_',
        function ($scope, $route, $log, Restangular, SweetAlert, TeamService, Team, Session, _) {
            "use strict";

            $scope.currentOrganisation = Session.user.organisations[0];

            $scope.teams = _.filter(Session.user.teams, function (team) {
                var orgMemberId = $scope.currentOrganisation.members._id || $scope.currentOrganisation.members;
                return team._id != orgMemberId;
            });

            $scope.currentTeam = $scope.teams[0];


            var setTeam = function (team) {
                $scope.currentTeam = team;
                $scope.members = [];
                $scope.orgMembers = [];
                TeamService.getMembers($scope.currentTeam, function (err, members) {
                    $scope.members = members;

                    for (var i = 0; i < $scope.members.length; i++) {
                        // This is to allow Restangular do put & remove on these objects.
                        $scope.members[i].self = {};
                        $scope.members[i].self.link = '/api/users/' + $scope.members[i]._id;
                    }

                    // Only show users that are not in the current team, in the org team list
                    $scope.orgMembers = _.filter(Session.org.members, function (member) {
                        var found = !!_.find($scope.members, {_id: member._id});

                        return !found;
                    });
                });
            };

            // Initialize team
            setTeam($scope.currentTeam);


            $scope.saveTeam = function () {
                if ($scope.currentTeam._id) {
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
                } else {
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

            $scope.selectTeam = function (team) {
                setTeam(team);
            };

            $scope.addToTeam = function (member) {

                var args = {
                    team: $scope.currentTeam,
                    userId: member._id || member
                };

                TeamService.addMember(args, function (err, team) {
                    if (err) {
                        $scope.addMemberError = err.message;
                    } else {
                        if (team) {
                            $scope.currentTeam = team;
                            if (Session.user._id == member._id) {
                                Session.user.teams.push($scope.currentTeam);
                            }

                            _.pull($scope.orgMembers, member);
                            $scope.members.push(member);
                            member.teams.push($scope.currentTeam);


                        } else {
                            $scope.addMemberError = 'There was an error adding that member to the team';
                        }
                    }
                });
            };

            $scope.removeFromTeam = function (member) {

                var args = {
                    team: $scope.currentTeam,
                    userId: member._id || member
                };

                TeamService.removeMember(args, function (err, team) {
                    if (err) {
                        $scope.removeMemberError = err.message;
                    } else {
                        if (team) {
                            _.pull($scope.members, member);
                            if (Session.user._id == member._id) {
                                _.pull(Session.user.teams, $scope.currentTeam);
                            }
                            _.pull(member.teams, $scope.currentTeam);
                            $scope.orgMembers.push(member);
                            $scope.currentTeam = team;

                        } else {
                            $scope.removeMemberError = 'There was an error adding that member to the team';
                        }
                    }

                });
            };

        }
    ])
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
