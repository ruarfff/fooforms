var FooForm = angular.module('FooForm', ['ngSanitize', 'pikaday', 'textAngular'])
    .config(function ($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            // Allow loading from our assets domain.  Notice the difference between * and **.
            'https://fooforms.com/**'
        ])
    })
    .controller('FormCtrl', ['$scope', '$http', '$location', '$timeout', function ($scope, $http, $location, $timeout) {
        var path = $location.absUrl().split('/');
        var formPart = path[path.length - 1];
        var formId = (window.hasOwnProperty('formId')) ? window.formId : formPart;
        var resizeCount = 0;
        var hostEnv = (window.location.hostname === 'localhost') ? 'localhost:3000' : 'fooforms.com';
        var url = 'https://' + hostEnv + '/forms/repo/fetch/' + formId;
        var postUrl = 'https://' + hostEnv + '/forms/repo/post';


        $scope.sorted = false;
        $scope.errorPosting = false;


        $scope.doResize = function () {
            if (typeof parent.resizeIframe === "function") {
                resizeCount++;
                if (resizeCount < 10) {
                    var height = angular.element('#formLayout').height();
                    parent.resizeIframe(formId, height);
                    $timeout($scope.doResize(), 500);
                }
            }
        };

        $http({
            url: url,
            method: 'GET'
        }).success(function (data) {
            var form = data;

            $scope.post = angular.copy(form);

            $scope.post.postStream = form.postStreams[0]._id || form.postStreams[0];
            if ($scope.post._id) {
                delete $scope.post._id;
            }

        }).error(function (data, status) {
            $scope.error = status;
        });
        $scope.submit = function () {
            $scope.processing = true;
            $http({
                url: postUrl,
                method: "POST",
                data: $scope.post,
                headers: {'Content-Type': 'application/json'}
            }).success(function () {
                $scope.sorted = true;
                $scope.$apply();
                $scope.doResize();
            }).error(function (data, status) {
                $scope.sorted = false;
                $scope.errorPosting = true;
                $scope.status = status;
                $scope.$apply();
            });
        };
    }])
    .directive('compile', ['$compile', function ($compile) {
        'use strict';
        // directive factory creates a link function
        return function (scope, element, attrs) {
            scope.$watch(
                function (scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compile);
                },
                function (value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);

                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);
                }
            );
        };
    }]);
