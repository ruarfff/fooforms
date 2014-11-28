/* global angular */

angular.module('form').controller('FormCtrl',
    ['$scope', '$location', '$log', 'FormService', 'StoreService',
        function ($scope, $location, $log, FormService, StoreService) {
            'use strict';

            $scope.store = {};
            $scope.categories = [];
            $scope.activeCategory = 'yourForms';

            $scope.setCategory = function (category) {
                $scope.activeCategory = category.displayName;
            };

            StoreService.getStore().then(function (res) {
                $scope.categories = res.data.teams;
            }, function (err) {
                $log.error(err);
            })

        }]);

