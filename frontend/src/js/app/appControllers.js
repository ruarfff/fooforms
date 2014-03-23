fooformsApp.controller('AppsCtrl', ['$scope', 'AppService', 'Apps',
    function ($scope, AppService, Apps) {
        'use strict';
        $scope.appUrl = ''; // Temporary helper variable to view app JSON
        $scope.appName = '';


        AppService.getUserApps(function (err) {
            if(err) {
                console.log(err.toString());
            } else {
                $scope.apps = Apps.apps;
            }
        });

        $scope.hover = function (app) {
            // Shows/hides the delete button on hover
            return app.showOptions = !app.showOptions;
        };

        $scope.viewApp = function (app) {
            $scope.appUrl = app.url;
            $scope.appName = app.name;
        };

        $scope.newApp = function () {
            Apps.resetCurrentApp();
        };

        $scope.updateApp = function (app) {
            Apps.setCurrentApp(app);

        };

        $scope.deleteApp = function (app) {
          AppService.deleteApp(app, function (err) {
                if(err) {
                    console.log(err.toString());
                } else {
                    Apps.resetCurrentApp();
                    $scope.apps = Apps.apps;
                }
            });
        };

    }]);

