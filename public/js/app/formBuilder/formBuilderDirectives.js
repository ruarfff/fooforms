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
    }]).directive('calculation', [function () {

        return {
            restrict: 'E',
            scope: false,


            controller: function ($scope, $element) {


                var index;
                if (angular.isUndefined($scope.postObj)) {
                    $scope.postObj = $scope.activePost;
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

                $scope.$watch('fieldA', function () {
                    calculate();
                }, true);
                $scope.$watch('fieldB', function () {
                    calculate();
                }, true);


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

                var index, fieldA, fieldB;
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
                    var result = 0;
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
                    return $scope.repeater.value;
                }
            },
            replace: false,
            templateUrl: '/partials/calculationGroupBox.html'
        };

    }]).directive('uploader', ['$upload', '$log','SweetAlert' ,function ($upload, $log,SweetAlert) {

        return {
            restrict: 'E',
            scope: {

                formField: '=formField',
                onFileSelect: "&onFileSelect",
                doFileUpload: "&doFileUpload"

            },
            link: function (scope, elem, attrs, ctrl) {

                //   ctrl.$setValidity('error', true);

                scope.onFileSelect = function (selectedFile) {

                    scope.uploadFile = selectedFile[0];


                    scope.doFileUpload();

                };

                scope.doFileUpload = function () {
                    scope.uploading=true;
                    scope.upload = $upload.upload({
                        url: '/api/files',
                        method: 'POST',
                        // headers: {'header-key': 'header-value'},
                        // withCredentials: true,
                        data: {file: scope.uploadFile}

                    }).progress(function (evt) {
                        scope.formField.progress = (parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function (data, status, headers, config) {
                        // file is uploaded successfully
                        scope.uploadFile = [];
                        scope.allowUpload = null;
                        scope.formField.progress = 0;
                        scope.uploading=false;

                        if (data.err) {
                            $log.error(data.err);
                            //ctrl.$setValidity('error', false);
                        } else {
                            scope.formField.value = data;
                        }

                    }).error(function (err, code,headers) {
                        SweetAlert.swal('Not Saved!', 'An error occurred trying to upload this file.', 'error');
                        scope.formField.progress = 0;
                        scope.uploading=false;
                    });
                }
            },
            replace: false,
            templateUrl: '/partials/uploader.html'
        };
    }])
    .directive('formName', ['$http', function ($http) {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                scope.busy = false;
                scope.$watch(attrs.ngModel, function (value) {
                    scope.ctrl = ctrl;
                    // hide old error messages
                    ctrl.$setValidity('isTaken', true);
                    ctrl.$setValidity('error', true);
                    ctrl.$setValidity('invalidChars', true);

                    if (!value) {
                        // don't send undefined to the server during dirty check
                        // empty form name is caught by required directive
                        return;
                    }
                    if (!scope.formLoaded) {
                        // don't send undefined to the server during dirty check
                        // empty form name is caught by required directive
                        scope.formLoaded=true;
                        return;
                    }

                    scope.formNameBusy = true;
                    $http.get('/api/forms/check/name/' + attrs.folder + '/' + value)
                        .success(function (data) {
                          if (data.exists) {
                                scope.sluggedFormName = '';
                                ctrl.$setValidity('isTaken', false);
                            } else if (data.slugged) {
                                scope.sluggedFormName = data.sluggedValue;
                            }else{
                                scope.sluggedFormName=scope.form.title;
                            }

                            scope.form.displayName=scope.sluggedFormName ;


                            scope.formNameBusy = false;
                        }).error(function (data) {
                            scope.sluggedFormName = '';
                            scope.form.displayName=scope.sluggedFormName;
                            ctrl.$setValidity('error', false);
                            scope.formNameBusy = false;
                        });
                })
            }
        }
    }]).constant('PikadayConfig', {})
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
