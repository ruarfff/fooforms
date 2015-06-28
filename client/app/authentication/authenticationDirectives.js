angular.module('fooforms.authentication')
    .directive('uniqueUsername', ['$http', function ($http) {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                scope.busy = false;
                scope.$watch(attrs.ngModel, function (value) {

                    // hide old error messages
                    ctrl.$setValidity('isTaken', true);
                    ctrl.$setValidity('error', true);
                    ctrl.$setValidity('invalidChars', true);

                    if (!value) {
                        // don't send undefined to the server during dirty check
                        // empty username is caught by required directive
                        return;
                    }

                    scope.usernameBusy = true;
                    $http.get('/signup/check/username/' + value)
                        .success(function (data) {

                            if (data.exists) {
                                scope.sluggedUsername = '';
                                ctrl.$setValidity('isTaken', false);
                            } else if (data.slugged) {
                                scope.usernameBusy = false;
                                scope.sluggedUsername = data.sluggedValue;
                            }
                            // everything is fine -> do nothing
                            scope.usernameBusy = false;
                        }).error(function (data) {
                            scope.sluggedUsername = '';
                            ctrl.$setValidity('error', false);
                            scope.usernameBusy = false;
                        });
                })
            }
        }
    }])
    .directive('uniqueOrgname', ['$http', function ($http) {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                scope.busy = false;
                scope.$watch(attrs.ngModel, function (value) {

                    // hide old error messages
                    ctrl.$setValidity('isTaken', true);
                    ctrl.$setValidity('error', true);
                    ctrl.$setValidity('invalidChars', true);

                    if (!value) {
                        // don't send undefined to the server during dirty check
                        // empty org name is caught by required directive
                        return;
                    }

                    scope.orgnameBusy = true;
                    $http.get('/signup/check/username/' + value)
                        .success(function (data) {

                            if (data.exists) {
                                scope.sluggedOrgName = '';
                                ctrl.$setValidity('isTaken', false);
                            } else if (data.slugged) {
                                scope.sluggedOrgName = data.sluggedValue;
                            }
                            // everything is fine -> do nothing
                            scope.orgnameBusy = false;
                        }).error(function (data) {
                            scope.sluggedOrgName = '';
                            ctrl.$setValidity('error', false);
                            scope.orgnameBusy = false;
                        });
                })
            }
        }
    }])
    .directive('match', [function () {
        return {
            require: 'ngModel',
            scope: {
                toMatch: "=match"
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.match = function (modelValue) {
                    return modelValue == scope.toMatch;
                };

                scope.$watch("toMatch", function () {
                    ngModel.$validate();
                });
            }
        }
    }])
    .directive('different', [function () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {

                scope.$watch('[' + attrs.ngModel + ', ' + attrs.different + ']', function (value) {
                    ctrl.$setValidity('different', value[0] != value[1]);
                }, true);

            }
        }
    }]);

