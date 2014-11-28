/* global angular */

angular.module('organisation').controller('OrganisationCtrl', ['$rootScope', '$scope', '$log', '_', 'SweetAlert', 'OrganisationService', 'Organisation', 'Session',
    function ($rootScope, $scope, $log, _, SweetAlert, OrganisationService, Organisation, Session) {
        'use strict';

        $scope.members = [];

        $scope.organisation = Session.user.organisations[0];

        OrganisationService.getMembers($scope.organisation, function (err, members) {
           $scope.members = members;
        });


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
