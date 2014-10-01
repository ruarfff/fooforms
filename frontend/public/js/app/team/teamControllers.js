angular.module('team')

    .controller('TeamCtrl',
    ['$scope', '$route', '$log', '$routeParams', 'Restangular', 'TeamService',
        function ($scope, $route, $log, $routeParams, Restangular, TeamService) {
            "use strict";

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
