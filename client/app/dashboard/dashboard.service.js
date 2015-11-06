angular.module('fooforms.dashboard').factory('dashboardService',
    ['$log', 'Restangular', 'session',
        function ($log, Restangular, session) {
            'use strict';
            var dashboardApi = Restangular.all('dashboard');
            return {
                getUserDashboard: function (next) {
                    dashboardApi.get('user/' + session.user._id).then(function (result) {
                        next(null, result);
                    }, function (err) {
                        $log.error(err);
                        next(err);
                    });
                },
                getCurrentOrgOrUser: function (name, next) {
                    dashboardApi.get('')
                }
            };
        }]);

