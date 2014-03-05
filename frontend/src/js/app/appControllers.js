fooformsApp.controller('AppsCtrl', ['$scope', 'Restangular', 'appService',
    function ($scope, Restangular, appService) {
        'use strict';
        Restangular.setBaseUrl('/api');
        Restangular.setDefaultHeaders({'Content-Type': 'application/json'});
        var appApi = Restangular.all('apps');
        $scope.appUrl = ''; // Temporary helper variable to view app JSON
        $scope.appName = '';

        var updateAppList = function () {
            appApi.getList().then(function (apps) {
                $scope.apps = apps;
            });
        };

        // Get all the existing apps and save them in the scope
        updateAppList();

        $scope.hover = function (app) {
            // Shows/hides the delete button on hover
            return app.showOptions = !app.showOptions;
        };

        $scope.viewApp = function (app) {
            $scope.appUrl = app.url;
            $scope.appName = app.name;
        };

        $scope.newApp = function () {
            appService.resetApp();
        }

        $scope.updateApp = function (app) {
            appService.setApp(app);

        };

        $scope.deleteApp = function (app) {
            app.remove().then(function (res) {
                // TODO: Do I need ot check the response for anything
                var index = $scope.apps.indexOf(app);

                if (index > -1) {
                    $scope.apps.splice(index, 1);
                }
            }, function (err) {
                // This only gets called if there's an error response
                console.log(err.status);
                $("#thumb-" + app._id).effect("shake");
            });
        };

    }]);

