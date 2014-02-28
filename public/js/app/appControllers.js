'use strict';

fooformsApp.controller('AppsCtrl', ['$scope', 'Restangular',
    function ($scope, Restangular) {
        Restangular.setBaseUrl('/api');
        Restangular.setDefaultHeaders({'Content-Type': 'application/json'});
        var appApi = Restangular.all('apps');

        var updateAppList = function () {
            appApi.getList().then(function (apps) {
                console.log('Got apps: ' + JSON.stringify(apps));
                $scope.apps = apps;
            });
        };

        // Get all the existing apps and save them in the scope
        updateAppList();
    }]);

