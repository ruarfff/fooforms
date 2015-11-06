angular.module('fooforms.dashboard')
    // For rendering a the Forms Menu in the sidebar
    .directive('orgMenu', [
        function () {
            return {
                restrict: 'E',
                transclude: true,
                controller: function ($log, $scope, _, session) {

                },
                templateUrl: '/template/dashboard/org-menu.html'
            };
        }
    ]);



