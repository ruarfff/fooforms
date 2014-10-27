angular.module('organisation').directive('uniqueOrgName', ['$http', function ($http) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            scope.busy = false;
            scope.$watch(attrs.ngModel, function (value) {

                // hide old error messages
                ctrl.$setValidity('isTaken', true);
                ctrl.$setValidity('invalidChars', true);

                if (!value) {
                    // don't send undefined to the server during dirty check
                    // empty org name is caught by required directive
                    return;
                }

                scope.busy = true;
                $http.get('/signup/check/username/' + value)
                    .success(function (data) {

                        if (data.exists) {
                            ctrl.$setValidity('isTaken', false);
                        } else if (data.slugged) {
                            $scope.sluggedOrgName = data.sluggedValue;
                            ctrl.$setValidity('slugged', false);
                        }
                        // everything is fine -> do nothing
                        scope.busy = false;
                    });
            })
        }
    }
}]).factory('OrganisationService',
    ['$log', 'Restangular',
        function ($log, Restangular) {
            'use strict';
            var orgApi = Restangular.all('organisation');

            return {

                createOrg: function (team, next) {
                    orgApi.post(team).then(function (res) {
                        return next(null, res);
                    }, function (err) {
                        $log.error(err);
                        return next(err);
                    });
                },
                updateOrg: function (team, next) {
                    orgApi.put().then(function (res) {
                        return next(null, res);
                    }, function (err) {
                        $log.error(err);
                        return next(err);
                    });
                },
                deleteOrg: function (team, next) {
                    orgApi.remove().then(function () {
                        return next(null);
                    }, function (err) {
                        $log.error(err);
                        return next(err);
                    });
                }

            }


        }]).service('Organisation', function () {
        'use strict';
        this.activeOrg = {};

        this.setOrg= function (team) {
            this.activeOrg= team;
            return this.activeOrg;
        };

        return this;
    });
