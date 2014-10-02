/* global angular */

angular.module('organisation').controller('OrganisationCtrl', ['$scope', '$route', '$log', 'Restangular', 'Session', function ($scope, $route, $log, Restangular, Session) {
    'use strict';


    $scope.organisation = _.find(Session.user.organisations, { 'displayName': $route.current.params.organisation });

}]);
