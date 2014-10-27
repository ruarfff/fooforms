/* global angular */

angular.module('organisation').controller('OrganisationCtrl', ['$rootScope', '$scope', '$log', '_', 'SweetAlert', 'OrganisationService', 'Organisation',
    function ($rootScope, $scope, $log, _, SweetAlert, OrganisationService, Organisation) {
        'use strict';


        $scope.updateOrg = function (org) {


            OrganisationService.updateOrg(org, function (err, res) {
                alert('done');
            })
        }

    }]);
