function nl2br(str, is_xhtml) {

    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; // Adjust comment to avoid issue on phpjs.org display

    return (str + '')
        .replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

var FooForm = angular.module('FooForm', ['ngSanitize', 'pikaday'])
    .config(function($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            // Allow loading from our assets domain.  Notice the difference between * and **.
            'https://fooforms.com/**'
        ])})
    .controller('FormCtrl', ['$scope', '$http', '$location', '$timeout',function ($scope, $http, $location, $timeout) {





        var path = $location.absUrl().split('/');
        path = path[path.length - 1];
        if (!window.hasOwnProperty(formId)) {
            var formId = path;
        }else{
            var formId=window.formId;
        }


        $scope.doResize = function(){

            // This will only run after the ng-repeat has rendered its things to the DOM
            $timeout(function(){
                var height = angular.element('#formLayout').height();
                parent.resizeIframe(formId,height);
            }, 500);

        };


        $scope.sorted = false;
        $scope.errorPosting = false;
        $http({
            url: 'https://fooforms.com/forms/repo/fetch/' + formId,
            method: 'GET'
        }).success(function (data) {
            var form = data;

            $scope.post = angular.copy(form);

            $scope.post.postStream = form.postStreams[0]._id || form.postStreams[0];
            if ($scope.post._id) {
                delete $scope.post._id;
            }

            setTimeout(function(){
                var height = angular.element('#formLayout').height();
                parent.resizeIframe(formId,height);
            },350);

        }).error(function (data, status) {
            $scope.error = status;
        });
        $scope.submit = function () {
            $http({
                url: 'https://fooforms.com/forms/repo/post',
                method: "POST",
                data: $scope.post,
                headers: {'Content-Type': 'application/json'}
            }).success(function () {
                $scope.sorted = true;
                $scope.$apply();
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
