angular.module('team')
    .factory('TeamService',
    ['$log', 'Restangular', 'Session',
        function ($log, Restangular, Session) {
            'use strict';
            var teamApi = Restangular.all('teams');

            return {

                createTeam: function (team, next) {
                    if (!team.members) {
                        team.members = [];
                    }
                    team.members.push(Session.user._id);
                    teamApi.post(team).then(function (res) {
                        Session.user.teams.push(res);
                        Session.user.put().then(function (res) {
                            return next(null, res);
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
                    teamApi.put().then(function (res) {
                        return next(null, res);
                    }, function (err) {
                        $log.error(err);
                        return next(err);
                    });
                },
                deleteTeam: function (team, next) {
                    teamApi.remove().then(function () {
                        return next(null);
                    }, function (err) {
                        $log.error(err);
                        return next(err);
                    });
                }

            }


        }])
    .service('Team', function () {
        'use strict';
        this.activeTeam = {};
        this.newTeam = function () {
            this.activeTeam = {displayName: '', description: ''};
            if (this.activeTeam._id) {
                delete this.activeTeam._id;
            }
            return this.activeTeam;
        };

        this.setTeam = function (team) {
            this.activeTeam = team;
            return this.activeTeam;
        };

        return this;
    });