var userApp = angular.module('userApp', []);

userApp.controller('ProfileCtrl', function ($scope, $http) {
    'use strict';
    $http.get('/api/user/me').success(function (data) {
        $scope.profile = data;
        alert('hello');
    })
})