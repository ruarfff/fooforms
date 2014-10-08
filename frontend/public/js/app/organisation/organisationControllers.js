/* global angular */

angular.module('organisation').controller('OrganisationCtrl', ['$scope', '$route', '$log', 'Restangular', 'Session', '_', function ($scope, $route, $log, Restangular, Session, _) {
    'use strict';


    $scope.organisation = _.find(Session.user.organisations, { 'displayName': $route.current.params.organisation });

}]);
