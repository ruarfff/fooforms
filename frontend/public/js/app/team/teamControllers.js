angular.module('team')

    .controller('TeamCtrl',
    ['$scope', '$route', '$log', 'Restangular', 'TeamService', 'Session',
        function ($scope, $route, $log, Restangular, TeamService, Session) {
            "use strict";

            $scope.team = _.find(Session.user.teams, {'displayName': $route.current.params.team });

            $scope.tabs = [
                {name: "Teams", active: true},
                {name: "Settings", active: false}
            ];


            // Create a new tab
            $scope.createTab = function (tab) {
                $scope.tabs.push(angular.copy(tab));
                $scope.$apply();
                angular.element('#' + tab.name).tab('show');
            };
        }]);
