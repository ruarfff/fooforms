angular.module('fooforms.team')
    .factory('teamService',
    ['$log', 'Restangular', 'session',
        function ($log, Restangular, session) {
            'use strict';
            var teamApi = Restangular.all('teams');
            var activeTeam = {};
            return {
                newTeam: function () {
                    activeTeam = {displayName: 'New Team', description: ''};
                    if (activeTeam._id) {
                        delete activeTeam._id;
                    }
                    return activeTeam;
                },
                setActiveTeam: function (team) {
                    activeTeam = team;
                    return activeTeam;
                },
                createTeam: function (team, next) {
                    if (!team.members) {
                        team.members = [];
                    }
                    team.members.push(session.user._id);
                    teamApi.post(team).then(function (teamResponse) {
                        session.user.teams.push(teamResponse);
                        session.user.put().then(function () {
                            return next(null, teamResponse);
                        }, function (err) {
                            $log.error(err);
                            return next(err);
                        });
                    }, function (err) {
                        $log.error(err);
                        return next(err);
                    });
                },
                updateTeam: function (team, next) {
                    if (typeof team.put !== 'function') {
                        team = Restangular.restangularizeElement(teamApi, team, '');
                    }
                    var memberIds = [];

                    for (var i = 0; i < team.members.length; i++) {
                        var member = team.members[i];
                        if (member) {
                            if (member._id) {
                                member = member._id;
                            }
                            memberIds.push(member);
                        }

                    }

                    team.members = memberIds;

                    team.put().then(function (res) {
                        return next(null, res);
                    }, function (err) {
                        $log.error(err);
                        return next(err);
                    });
                },
                deleteTeam: function (team, next) {
                    if (typeof team.remove !== 'function') {
                        team = Restangular.restangularizeElement(teamApi, team, '');
                    }
                    team.remove().then(function () {
                        return next(null);
                    }, function (err) {
                        $log.error(err);
                        return next(err);
                    });
                },
                getMembers: function (team, next) {
                    if (team) {
                        if (typeof team.getList !== 'function') {
                            team = Restangular.restangularizeElement(teamApi, team, '');
                        }
                        team.getList('members').then(function (members) {
                            return next(null, members);
                        }, function (err) {
                            $log.error(err);
                            return next(err);
                        });
                    }
                },
                addMember: function (args, next) {
                    if (typeof args.team.patch !== 'function') {
                        args.team = Restangular.restangularizeElement(teamApi, args.team, '');
                    }
                    args.team.patch({
                        action: 'addMember',
                        user: args.userId
                    }).then(function (team) {
                        return next(null, team);
                    }, function (err) {
                        return next(err);
                    });
                },
                removeMember: function (args, next) {
                    if (typeof args.team.patch !== 'function') {
                        args.team = Restangular.restangularizeElement(teamApi, args.team, '');
                    }
                    args.team.patch({
                        action: 'removeMember',
                        user: args.userId
                    }).then(function (team) {
                        return next(null, team);
                    }, function (err) {
                        return next(err);
                    });
                }
            }
        }]);

