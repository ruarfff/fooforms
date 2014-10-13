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
                },
                getDashboardPosts: function (args, next) {
                    var dashboardPostApi = Restangular.all('dashboard/posts');
                    var postStreams = args.postStreams;
                    var page = args.page || 1;
                    var pageSize = args.pageSize || 10;
                    if (!postStreams) {
                        $log.error(err);
                        return next(new Error('PostStreams are required to get posts'));
                    }
                    dashboardPostApi.getList({postStreams: postStreams, page: page, pageSize: pageSize}).then(function (posts) {
                        return next(null, posts);
                    }, function (err) {
                        $log.error(err);
                        return next(err);
                    });
                }
            };
        }]);

