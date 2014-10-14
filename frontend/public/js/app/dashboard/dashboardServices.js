/* global angular */

angular.module('dashboard').factory('DashboardService',
    ['$log', 'Restangular', 'Session',
        function ($log, Restangular, Session) {
            'use strict';
            var dashboardApi = Restangular.all('dashboard');
            return {
                getUserDashboard: function (next) {
                    dashboardApi.get('user/' + Session.user._id).then(function (result) {
                        next(null, result);
                    }, function (err) {
                        $log.error(err);
                        next(err);
                    });
                }
            };
        }]);

