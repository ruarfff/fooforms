/* global angular */

angular.module('organisation').controller('OrganisationCtrl', ['$rootScope', '$scope', '$log', '_', 'SweetAlert', 'OrganisationService', 'Organisation',
    function ($rootScope, $scope, $log, _, SweetAlert, OrganisationService, Organisation) {
        'use strict';


        $scope.updateOrg = function (org) {

            var orgDetails = {
                "_id": org._id,
                "photo": org.photo,
                "billingEmail": org.billingEmail,
                "title": org.title,
                "displayName": org.displayName

            };


            OrganisationService.updateOrg(orgDetails, function (err, res) {
                if (err) {
                    SweetAlert.swal('Not Saved!', 'An error occurred trying to update the organisation.', 'error');
                } else {

                    SweetAlert.swal('Saved!', 'Your organisation has been updated.', 'success');
                }

            })
        }

    }]);
