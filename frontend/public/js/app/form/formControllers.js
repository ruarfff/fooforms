/* global angular */

angular.module('form').controller('FormCtrl',
    ['$scope', '$location', '$log', 'FormService',
        function ($scope, $location, $log, FormService) {
            'use strict';
            $scope.formUrl = ''; // Temporary helper variable to view form JSON
            $scope.formName = '';


            $scope.hover = function (form) {
                // Shows/hides the delete button on hover
                return form.showOptions = !form.showOptions;
            };

            $scope.viewForm = function (form) {
                $scope.formUrl = form.url;
                $scope.formName = form.name;
            };

            $scope.openForm = function (form) {
                $location.path($scope.user.displayName + '/' + form.name);
            };

        }]);

