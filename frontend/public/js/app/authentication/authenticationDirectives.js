angular.module('authentication').directive('uniqueUsername', ['$http', function ($http) {
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
                    // empty username is caught by required directive
                    return;
                }

                scope.busy = true;
                $http.get('/signup/check/username/' + value)
                    .success(function (data) {

                        if (data.exists) {
                            ctrl.$setValidity('isTaken', false);
                        } else if (data.invalidChars) {
                            ctrl.$setValidity('invalidChars', false);
                        }
                        // everything is fine -> do nothing
                        scope.busy = false;
                    });
            })
        }
    }
}]);

angular.module('authentication').directive('match', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {

            scope.$watch('[' + attrs.ngModel + ', ' + attrs.match + ']', function (value) {
                ctrl.$setValidity('match', value[0] === value[1]);
            }, true);

        }
    }
}]);
