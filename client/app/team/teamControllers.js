angular.module('fooforms.team')
    .controller('TeamCtrl',
    ['$scope', '$route', '$log', 'Restangular', 'SweetAlert', '_', 'teamService', 'session',
        function ($scope, $route, $log, Restangular, SweetAlert, _, teamService, session) {
            'use strict';

            $scope.currentOrganisation = session.user.organisations[0];

            $scope.teams = _.filter(session.user.teams, function (team) {
                var orgMemberId = $scope.currentOrganisation.members._id || $scope.currentOrganisation.members;
                return team._id != orgMemberId;
            });

            $scope.currentTeam = $scope.teams[0];


            var setTeam = function (team) {
                $scope.currentTeam = team;
                $scope.members = [];
                $scope.orgMembers = [];
                teamService.getMembers($scope.currentTeam, function (err, members) {
                    $scope.members = members;

                    for (var i = 0; i < $scope.members.length; i++) {
                        // This is to allow Restangular do put & remove on these objects.
                        $scope.members[i].self = {};
                        $scope.members[i].self.link = '/api/users/' + $scope.members[i]._id;
                    }

                    // Only show users that are not in the current team, in the org team list
                    $scope.orgMembers = _.filter(session.org.members, function (member) {
                        var found = !!_.find($scope.members, {_id: member._id});

                        return !found;
                    });
                });
            };

            // Initialize team
            setTeam($scope.currentTeam);


            $scope.saveTeam = function () {
                if ($scope.currentTeam._id) {
                    teamService.updateTeam($scope.currentTeam, function (err, team) {
                        if (err) {
                            $scope.saveTeamError = err.message;
                        } else {
                            var index = session.user.organisations.indexOf($scope.currentOrganisation);
                            var teamIndex = session.user.organisations[index].teams.indexOf(team);
                            session.user.organisations[index].teams[teamIndex] = team;
                            SweetAlert.swal('Saved!', 'Your team has been updated.', 'success');
                        }
                    });
                } else {
                    $scope.currentTeam.organisation = $scope.currentOrganisation._id;
                    teamService.createTeam($scope.currentTeam, function (err, team) {
                        if (err) {
                            $scope.saveTeamError = err.message;
                        } else {
                            var index = session.user.organisations.indexOf($scope.currentOrganisation);
                            session.user.organisations[index].teams.push(team);
                            $scope.currentTeam = teamService.newTeam();
                            SweetAlert.swal('Saved!', 'Your team has been saved.', 'success');
                        }
                    });
                }

            };

            $scope.newTeam = function () {
                $scope.currentTeam = teamService.newTeam();
            };

            $scope.selectTeam = function (team) {
                setTeam(team);
            };

            $scope.deleteTeam = function () {
                SweetAlert.swal({
                        title: 'Are you sure?', text: 'You will not be able to recover this team!',
                        type: 'warning',
                        showCancelButton: true, confirmButtonColor: '#DD6B55',
                        confirmButtonText: 'Yes, delete it!', closeOnConfirm: false
                    },
                    function () {
                        teamService.deleteTeam($scope.currentTeam, function (err, res) {
                            if (err) {
                                SweetAlert.swal('Not Deleted!', 'An error occurred trying to delete the team.', 'error');
                                $log.error(err);
                            } else {

                                SweetAlert.swal('Deleted!', 'Your team has been deleted.', 'success');
                            }
                        });
                    });


            };

            $scope.addToTeam = function (member) {
                var args = {
                    team: $scope.currentTeam,
                    userId: member._id || member
                };

                teamService.addMember(args, function (err, team) {
                    if (err) {
                        $scope.addMemberError = err.message;
                    } else {
                        if (team) {
                            $scope.currentTeam = team;
                            if (session.user._id == member._id) {
                                session.user.teams.push($scope.currentTeam);
                            }

                            _.pull($scope.orgMembers, member);
                            $scope.members.push(member);
                            member.teams.push($scope.currentTeam);


                        } else {
                            SweetAlert.swal('Not Moved!', 'There was an error adding that member to the team.', 'error');
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

                if ($scope.currentTeam.members.length === 1) {
                    SweetAlert.swal('Not Moved!', 'Your team needs at least one member.', 'error');
                } else {
                    teamService.removeMember(args, function (err, team) {
                        if (err) {
                            $scope.removeMemberError = err.message;
                        } else {
                            if (team) {
                                _.pull($scope.members, member);
                                if (session.user._id == member._id) {
                                    _.pull(session.user.teams, $scope.currentTeam);
                                }
                                _.pull(member.teams, $scope.currentTeam);
                                $scope.orgMembers.push(member);
                                $scope.currentTeam = team;

                            } else {
                                $scope.removeMemberError = 'There was an error adding that member to the team';
                            }
                        }
                    });
                }
            };
        }
    ]);

