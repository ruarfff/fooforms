angular.module('fooforms.organisation').controller('OrganisationCtrl',
    ['$rootScope', '$scope', '$log', '_', 'SweetAlert', 'organisationService', 'organisation', 'session',
        function ($rootScope, $scope, $log, _, SweetAlert, organisationService, organisation, session) {
            'use strict';

            $scope.members = [];

            $scope.organisation = session.user.organisations[0];

            organisationService.getMembers($scope.organisation, function (err, members) {
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


                organisationService.updateOrg(orgDetails, function (err, res) {
                    if (err) {
                        SweetAlert.swal('Not Saved!', 'An error occurred trying to update the organisation.', 'error');
                    } else {

                        SweetAlert.swal('Saved!', 'Your organisation has been updated.', 'success');
                    }

                })
            }

        }]);
