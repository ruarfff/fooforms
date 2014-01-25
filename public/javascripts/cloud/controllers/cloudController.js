/*jslint node: true */
'use strict';

var fooformsApp = angular.module('fooformsApp', ['restangular']);

fooformsApp.controller('CloudCtrl', function ($scope, Restangular) {
    Restangular.setBaseUrl('/api');

    /* Get all clouds for this user */
    $scope.clouds = Restangular.all('clouds').getList().$object;

    $scope.cloud = $scope.clouds[0];


    $scope.save = function (cloud) {

    }


});