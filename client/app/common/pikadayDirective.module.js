angular.module('pikaday', [])

    .constant('PikadayConfig', {})

    .directive('pikaday', ['PikadayConfig', function (PikadayConfig) {
        PikadayConfig = PikadayConfig || {};

        return {
            scope: {
                'date': '=ngModel'
            },
            require: 'ngModel',
            link: function ($scope, elem, attrs) {
                var options = {
                    field: elem[0],
                    defaultDate: $scope.date,
                    setDefaultDate: true
                };
                angular.extend(options, PikadayConfig, attrs.pikaday ? $scope.$parent.$eval(attrs.pikaday) : {});

                var onSelect = options.onSelect;

                options.onSelect = function (date) {
                    $scope.date = date;
                    $scope.$apply($scope.date);

                    if (angular.isFunction(onSelect)) {
                        onSelect();
                    }
                };

                var picker = new Pikaday(options);

                $scope.$on('$destroy', function () {
                    picker.destroy();
                });
            }
        };
    }]);
