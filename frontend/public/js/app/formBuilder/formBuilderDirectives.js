/* global angular */

angular.module('formBuilder')


// not used but may be useful some day......

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
    }).directive('calculation', [function () {

        return {
            restrict: 'E',
            scope: false,


            controller: function ($scope, $element) {



                   var index;
                   if (angular.isUndefined($scope.postObj)){
                       $scope.postObj=$scope.posts.activePost;
                   }
                   var count = $scope.postObj.fields.length;

                   if ($scope.formField.options.field1.item == 'Specified Value') {
                       $scope.fieldA = $scope.formField.options.field1;
                   } else {
                       for (index = 0; index < count; index++) {
                           if ($scope.postObj.fields[index].id == $scope.formField.options.field1.item) {
                               $scope.fieldA = $scope.postObj.fields[index];
                               break;
                           }
                       }
                   }

                   if ($scope.formField.options.field2.item == 'Specified Value') {
                       $scope.fieldB = $scope.formField.options.field2;
                   } else {
                       for (index = 0; index < count; index++) {
                           if ($scope.postObj.fields[index].id == $scope.formField.options.field2.item) {
                               $scope.fieldB = $scope.postObj.fields[index];
                               break;
                           }
                       }
                   }

                $scope.$watch('fieldA', function(){
                       calculate();
                   },true);
                $scope.$watch('fieldB', function(){
                       calculate();
                   },true);



function calculate() {
    var result = 0;
    switch ($scope.formField.options.operator) {
        case '+' :
            $scope.formField.value = ($scope.fieldA.value + $scope.fieldB.value);
            break;
        case '-' :
            $scope.formField.value = ($scope.fieldA.value * $scope.fieldB.value);
            break;
        case '*' :
            $scope.formField.value = ($scope.fieldA.value * $scope.fieldB.value);
            break;
        case '/' :
            $scope.formField.value = ($scope.fieldA.value / $scope.fieldB.value);
            break;

    }
    return $scope.formField.value;
}

            },
            replace: false,
            templateUrl: '/partials/calculation.html'
        };

    }]).directive('calculationGroupBox', [function () {

        return {
            restrict: 'E',
            scope: false,


            controller: function ($scope, $element) {

                var index, fieldA,fieldB;
                var count = $scope.formField.fields.length; //the groupbox

                if ($scope.repeater.options.field1.item == 'Specified Value') {
                    $scope.fieldA = $scope.repeater.options.field1;
                } else {
                    for (index = 0; index < count; index++) {
                        if ($scope.formField.fields[index].id == $scope.repeater.options.field1.item.split('_')[1]) {
                            $scope.fieldA = $scope.formField.repeaters[$scope.$parent.$parent.$index].fields[index];
                            break;
                        }
                    }
                }

                if ($scope.repeater.options.field1.item == 'Specified Value') {
                    $scope.fieldB = $scope.repeater.options.field2;
                } else {
                    for (index = 0; index < count; index++) {
                        if ($scope.formField.fields[index].id == $scope.repeater.options.field2.item.split('_')[1]) {
                            $scope.fieldB = $scope.formField.repeaters[$scope.$parent.$parent.$index].fields[index];
                            break;
                        }
                    }
                }


                $scope.$watch("fieldA.value", function () {
                    $scope.calculate();
                    //alert();
                });
                $scope.$watch("fieldB.value", function () {
                    $scope.calculate();
                });

                $scope.calculate = function () {
                    var result=0;
                    switch ($scope.repeater.options.operator) {
                        case '+' :
                            $scope.repeater.value = ($scope.fieldA.value + $scope.fieldB.value);
                            break;
                        case '-' :
                            $scope.repeater.value = ($scope.fieldA.value * $scope.fieldB.value);
                            break;
                        case '*' :
                            $scope.repeater.value = ($scope.fieldA.value * $scope.fieldB.value);
                            break;
                        case '/' :
                            $scope.repeater.value = ($scope.fieldA.value / $scope.fieldB.value);
                            break;

                    }
                    return $scope.repeater.value ;
                }
            },
            replace: false,
            templateUrl: '/partials/calculationGroupBox.html'
        };

    }]).directive('uploader', ['$upload', function ($upload) {

        return {
            restrict: 'E',
            scope: {

                formField: '=formField',
                message: '=message',
                onFileSelect: "&onFileSelect",
                doFileUpload: "&doFileUpload"

            },
            link: function (scope, elem, attrs, ctrl) {


                scope.onFileSelect = function (selectedFile) {

                    scope.uploadFile = selectedFile[0];


                    scope.doFileUpload();

                };

                scope.doFileUpload = function () {


                    scope.upload = $upload.upload({
                        url: '/api/file', //upload.php script, node.js route, or servlet url
                        // method: POST or PUT,
                        // headers: {'header-key': 'header-value'},
                        // withCredentials: true,
                        data: {file: scope.uploadFile}

                    }).progress(function (evt) {
                        scope.formField.progress = (parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function (data, status, headers, config) {
                        // file is uploaded successfully
                        scope.uploadFile = [];
                        scope.allowUpload = null;
                        if (data.err) {
                            setMessage(true, 'File Failed Validation', data.err, 'alert-danger');

                        } else {
                            scope.formField.value = data;

                        }

                    }).error(function (err) {
                        alert(err);
                    });


                }

            },
            replace: false,
            templateUrl: '/partials/uploader.html'
        };

    }]).directive('profileUploader', ['$upload', function ($upload) {

        return {
            restrict: 'E',
            scope: {

                user: '=user',
                message: '=message',
                onFileSelect: "&onFileSelect",
                doFileUpload: "&doFileUpload"

            },
            link: function (scope, elem, attrs, ctrl) {


                scope.onFileSelect = function (selectedFile) {

                    scope.uploadFile = selectedFile[0];


                    scope.doFileUpload();

                };

                scope.doFileUpload = function () {


                    scope.upload = $upload.upload({
                        url: '/api/file', //upload.php script, node.js route, or servlet url
                        // method: POST or PUT,
                        // headers: {'header-key': 'header-value'},
                        // withCredentials: true,
                        data: {file: scope.uploadFile}

                    }).progress(function (evt) {
                        //scope.formField.progress = (parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function (data, status, headers, config) {
                        // file is uploaded successfully
                        scope.uploadFile = [];
                        scope.allowUpload = null;
                        if (data.err) {
                            setMessage(true, 'File Failed Validation', data.err, 'alert-danger');

                        } else {
                            scope.user.photo = data._id;

                        }

                    }).error(function (err) {
                        alert(err);
                    });



                }

            },
            replace: false,
            templateUrl: '/partials/profileUploader.html'
        };

    }]);
