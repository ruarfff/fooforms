var FooForm = angular.module('FooForm', ['ngSanitize', 'textAngular'])
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
        path = path[path.length - 1];
        if (!window.hasOwnProperty(formId)) {
            var formId = path;
        } else {
            var formId = window.formId;
        }

        $scope.doResize = function () {

            var height = angular.element('#formLayout')[0].scrollHeight;
            parent.resizeIframe(formId, height);


        };

        $scope.sorted = false;
        $scope.errorPosting = false;

        var hostName = window.location.hostname;
        if (hostName == 'localhost') {
            var url = 'http://localhost:3000/forms/repo/fetch/' + formId;
            var postUrl = 'http://localhost:3000/forms/repo/post';
        } else {
            var url = 'https://fooforms.com/forms/repo/fetch/' + formId;
            var postUrl = 'https://fooforms.com/forms/repo/post';
        }

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


            if (typeof parent.resizeIframe === "function") {

                $timeout(function () {
                    $scope.doResize()
                }, 250);
                $timeout(function () {
                    $scope.doResize()
                }, 500);
                $timeout(function () {
                    $scope.doResize()
                }, 1000);
                $timeout(function () {
                    $scope.doResize()
                }, 3000);
                $timeout(function () {
                    $scope.doResize()
                }, 9000);


            }
            $scope.addRepeat = function (groupBoxId, row) {
                var requireRefresh = false;
                var groupBox = _.findIndex($scope.post.fields, function (field) {
                    return field.id == groupBoxId
                });

                var tempRepeaters = angular.copy($scope.post.fields[groupBox].repeaters);

                var repeater = {};
                repeater.id = new Date().getTime();
                repeater.fields = angular.copy($scope.post.fields[groupBox].fields);

                // need to swap out the field.id's for new ones.
                var fieldCount = repeater.fields.length;

                for (var fieldIndex = 0; fieldIndex < fieldCount; fieldIndex++) {
                    var fieldId = repeater.fields[fieldIndex].id;
                    repeater.fields[fieldIndex].id = repeater.id + '_' + fieldId;

                    // Fields specified in calculation need filedIds updated
                    if (repeater.fields[fieldIndex].type == 'calculation') {

                        requireRefresh = true;

                        if (repeater.fields[fieldIndex].options.field1.item != 'Specified Value') {
                            var fieldItem = repeater.fields[fieldIndex].options.field1.item;
                            repeater.fields[fieldIndex].options.field1.item = repeater.id + '_' + fieldItem;
                        }
                        if (repeater.fields[fieldIndex].options.field2.item != 'Specified Value') {
                            var fieldItem = repeater.fields[fieldIndex].options.field2.item;
                            repeater.fields[fieldIndex].options.field2.item = repeater.id + '_' + fieldItem;
                        }
                    }

                    if (repeater.fields[fieldIndex].type == 'progress') {

                        requireRefresh = true;

                        if (repeater.fields[fieldIndex].options.updateMethod) {
                            var fieldItem = repeater.fields[fieldIndex].options.updateField;
                            repeater.fields[fieldIndex].options.updateField = repeater.id + '_' + fieldItem;
                        }

                    }
                }


                if ($scope.post.fields[groupBox].repeaters.length === 0) {
                    $scope.post.fields[groupBox].repeaters.splice(row + 1, 0, repeater);
                } else {
                    tempRepeaters.splice(row + 1, 0, repeater);
                    //we've changed the structure of the array so all the watchers are pointing to the wrong place.
                    //We need to dump the repeater array and then recreate with scope applied to recreate the correct watchers.
                    // But only if we have fields requiring watchers, such as calc or progress
                    if (requireRefresh) {
                        $scope.post.fields[groupBox].repeaters = [];
                        $timeout(function () {
                            $scope.post.fields[groupBox].repeaters = angular.copy(tempRepeaters);

                        });
                    } else {
                        $scope.post.fields[groupBox].repeaters = angular.copy(tempRepeaters);
                    }


                }


            };
            $scope.removeRepeat = function (groupBoxId, row) {

                var groupBox = _.findIndex($scope.post.fields, function (field) {
                    return field.id == groupBoxId
                });
                var tempRepeaters = angular.copy($scope.post.fields[groupBox].repeaters);

                tempRepeaters.splice(row, 1);
                //we've changed the structure of the array so all the watchers are pointing to the wrong place.
                //We need to dump the repeater array and then recreate with scope applied to recreate the correct watchers.

                $scope.post.fields[groupBox].repeaters = [];
                $timeout(function () {
                    $scope.post.fields[groupBox].repeaters = angular.copy(tempRepeaters);
                });

            };


            // Check if the form has a GroupBox and if it's empty
            // If empty - then add the first repeater row
            if ($scope.post) {
                var groupBoxes = _.where($scope.post.fields, {type: 'groupBox'});
                var tables = _.where($scope.post.fields, {type: 'table'});
                groupBoxes = groupBoxes.concat(tables);
                if (groupBoxes.length > 0) {

                    var count = groupBoxes.length;
                    for (var i = 0; i < count; i++) {

                        var groupBoxIndex = _.findIndex($scope.post.fields, function (field) {
                            return field.id == groupBoxes[i].id
                        });
                        if (groupBoxIndex !== -1) {
                            if ($scope.post.fields[groupBoxIndex].repeaters.length === 0) {
                                $scope.addRepeat(groupBoxes[i].id, 0);
                            }
                        }


                    }

                }
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

                if (typeof parent.resizeIframe === "function") {
                    $scope.doResize();
                }

            }).error(function (data, status) {

                $scope.sorted = false;
                $scope.errorPosting = true;
                $scope.status = status;

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
    }]).directive('calculation', [function () {

        return {
            restrict: 'E',
            scope: false,


            controller: function ($scope, $filter, $element) {


                var index;
                if (!$scope.post) {
                    return;
                }

                $scope.postObj = $scope.post;


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
                            $scope.formField.value = ($scope.fieldA.value - $scope.fieldB.value);
                            break;
                        case '*' :
                            $scope.formField.value = ($scope.fieldA.value * $scope.fieldB.value);
                            break;
                        case '/' :
                            $scope.formField.value = ($scope.fieldA.value / $scope.fieldB.value);
                            break;
                        case '%' :
                            $scope.formField.value = ($scope.fieldA.value / $scope.fieldB.value) * 100;
                            break;

                    }
                    if (!isFinite($scope.formField.value)) {
                        $scope.formField.value = 0;
                    }
                    if (!$scope.formField.decimalPlaces) {
                        $scope.formField.decimalPlaces = 0;
                    }


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

                if ($scope.repeater.options.field2.item == 'Specified Value') {
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
                        case '%' :
                            $scope.repeater.value = ($scope.fieldA.value / $scope.fieldB.value) * 100;
                            break;

                    }

                    if (!isFinite($scope.repeater.value)) {
                        $scope.repeater.value = Number($filter('number')($scope.repeater.value, $scope.repeater.decimalPlaces));

                    }

                    // calculate total for use with SUM field
                    var count = $scope.formField.fields.length;
                    var repeatercount = $scope.formField.repeaters.length;
                    var total = 0;
                    var gboxFieldIndex = 0;
                    // get the index value for this field in the groupBox
                    for (var index = 0; index < count; index++) {
                        if ($scope.formField.fields[index].id == $scope.repeater.id.split('_')[1]) {
                            gboxFieldIndex = index;
                            break;
                        }
                    }
                    for (index = 0; index < repeatercount; index++) {
                        total += $scope.formField.repeaters[index].fields[gboxFieldIndex].value;
                    }
                    //We can store the total in the formField value as it's not used - values are tied to the repeaters
                    $scope.formField.fields[gboxFieldIndex].value = total;

                    return $scope.repeater.value;
                }
            },
            replace: false,
            templateUrl: '/partials/calculationGroupBox.html'

        }
    }]).directive('calculateSum', [function () {

        return {
            restrict: 'E',
            scope: false,


            controller: function ($scope, $filter, $element) {


                var index;
                if (!$scope.post) {
                    return;
                }

                $scope.postObj = $scope.post;


                var count = $scope.postObj.fields.length;
                var groupBoxCount = 0;
                var groupBoxIndex = 0;


                for (index = 0; index < count; index++) {
                    if ($scope.postObj.fields[index].id == $scope.formField.options.groupBoxId) {
                        groupBoxIndex = index;
                        groupBoxCount = $scope.postObj.fields[index].fields.length;
                        break;
                    }
                }

                for (index = 0; index < groupBoxCount; index++) {
                    if ($scope.postObj.fields[groupBoxIndex].fields[index].id == $scope.formField.options.calcFieldId) {
                        $scope.fieldToWatch = $scope.postObj.fields[groupBoxIndex].fields[index];
                        break;
                    }
                }


                if ($scope.fieldToWatch) {
                    $scope.$watch('fieldToWatch.value', function () {
                        $scope.formField.value = $scope.fieldToWatch.value;


                    }, true);
                }


            },
            replace: false,
            templateUrl: '/partials/calculateSum.html'
        };

    }]).directive('uploader', ['$upload', '$log', 'SweetAlert', function ($upload, $log, SweetAlert) {

        return {
            restrict: 'E',
            scope: {

                formField: '=formField'

            },
            link: function (scope, elem, attrs, ctrl) {

                //   ctrl.$setValidity('error', true);

                scope.onFileSelect = function (selectedFile) {
                    scope.uploadFile = selectedFile[0];
                    scope.doFileUpload();
                };

                scope.doFileUpload = function () {
                    scope.uploading = true;
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
                        scope.uploading = false;

                        if (data.err) {
                            $log.error(data.err);
                            //ctrl.$setValidity('error', false);
                        } else {
                            scope.formField.value = data;
                        }

                    }).error(function (err, code, headers) {
                        SweetAlert.swal('Not Saved!', 'An error occurred trying to upload this file.', 'error');
                        scope.formField.progress = 0;
                        scope.uploading = false;
                    });
                }
            },
            replace: false,
            templateUrl: '/partials/uploader.html'
        };
    }])
    .directive('groupUploader', ['$upload', '$log', 'SweetAlert', function ($upload, $log, SweetAlert) {

        return {
            restrict: 'E',
            scope: {

                repeater: '=repeater'

            },
            link: function (scope, elem, attrs, ctrl) {

                //   ctrl.$setValidity('error', true);

                scope.onFileSelectGroup = function (selectedFile) {

                    scope.uploadFile = selectedFile[0];


                    scope.doFileUpload();

                };

                scope.doFileUpload = function () {
                    scope.uploading = true;
                    scope.upload = $upload.upload({
                        url: '/api/files',
                        method: 'POST',
                        // headers: {'header-key': 'header-value'},
                        // withCredentials: true,
                        data: {file: scope.uploadFile}

                    }).progress(function (evt) {
                        scope.repeater.progress = (parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function (data, status, headers, config) {
                        // file is uploaded successfully
                        scope.uploadFile = [];
                        scope.allowUpload = null;
                        scope.repeater.progress = 0;
                        scope.uploading = false;

                        if (data.err) {
                            $log.error(data.err);
                            //ctrl.$setValidity('error', false);
                        } else {
                            scope.repeater.value = data;
                        }

                    }).error(function (err, code, headers) {
                        SweetAlert.swal('Not Saved!', 'An error occurred trying to upload this file.', 'error');
                        scope.repeater.progress = 0;
                        scope.uploading = false;
                    });
                }
            },
            replace: false,
            templateUrl: '/partials/groupUploader.html'
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
                        scope.formLoaded = true;
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
                            } else {
                                scope.sluggedFormName = scope.form.title;
                            }

                            scope.form.displayName = scope.sluggedFormName;


                            scope.formNameBusy = false;
                        }).error(function (data) {
                            scope.sluggedFormName = '';
                            scope.form.displayName = scope.sluggedFormName;
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
    }]).directive("toggleSwitch", function () {
        return {
            scope: {},
            require: "ngModel",
            restrict: "E",
            replace: "true",
            template: "<div class='animated pointer toggleSwitch text-{{css}}' ng-class='{toggleOff : !checked, toggleOn: checked}'><div class='animated pointer'>{{displayText}}</div><button class='btn btn-default animated'></button></div>",
            link: function (scope, elem, attrs, modelCtrl) {

                // Default Checkmark Styling
                scope.rotate = 'fa-rotate-180';
                // If size is undefined, Checkbox has normal size (Bootstrap 'xs')


                var trueValue = true;
                var falseValue = false;

                // If defined set true value
                if (attrs.ngTrueValue !== undefined) {
                    trueValue = attrs.ngTrueValue;
                }
                // If defined set false value
                if (attrs.ngFalseValue !== undefined) {
                    falseValue = attrs.ngFalseValue;
                }

                // Check if name attribute is set and if so add it to the DOM element
                if (scope.name !== undefined) {
                    elem.name = scope.name;
                }

                // Update element when model changes
                scope.$watch(function () {
                    if (modelCtrl.$modelValue === trueValue || modelCtrl.$modelValue === true) {
                        modelCtrl.$setViewValue(trueValue);
                        scope.displayText = attrs.onText;
                        scope.css = attrs.onStyle;
                        scope.rotate = 'fa-rotate-180';
                    } else {
                        modelCtrl.$setViewValue(falseValue);
                        scope.displayText = attrs.offText;
                        scope.css = attrs.offStyle;
                        scope.rotate = '';
                    }
                    return modelCtrl.$modelValue;
                }, function (newVal, oldVal) {
                    scope.checked = modelCtrl.$modelValue === trueValue;
                }, true);

                // On click swap value and trigger onChange function
                elem.bind("click", function () {
                    scope.$apply(function () {
                        if (modelCtrl.$modelValue === falseValue) {
                            modelCtrl.$setViewValue(trueValue);
                            scope.displayText = attrs.onText;
                            scope.css = attrs.onStyle;
                            scope.rotate = 'fa-rotate-180';
                        } else {
                            modelCtrl.$setViewValue(falseValue);
                            scope.displayText = attrs.offText;
                            scope.css = attrs.offStyle;
                            scope.rotate = '';
                        }
                    });
                });
            }
        };
    }).directive('fooProgressBar', [function () {

        return {
            restrict: 'EA',
            scope: false,


            controller: function ($scope, $element) {
                //updateMethod = true means auto update / false means manual


                var index;
                if (angular.isUndefined($scope.postObj)) {
                    $scope.postObj = $scope.post;
                }
                var count = $scope.postObj.fields.length;

                if ($scope.formField.options.updateMethod) {

                    for (index = 0; index < count; index++) {
                        if ($scope.postObj.fields[index].id == $scope.formField.options.updateField) {
                            $scope.progressValueField = $scope.postObj.fields[index];
                            break;
                        }
                    }


                    $scope.$watch('progressValueField', function () {
                        if (isFinite($scope.progressValueField.value)) {
                            $scope.formField.value = $scope.progressValueField.value;
                        } else {
                            $scope.formField.value = 0;
                        }

                    }, true);
                }
            }
        }

    }]).directive('fooGroupProgressBar', [function () {

        return {
            restrict: 'EA',
            scope: false,


            controller: function ($scope, $element) {
                //updateMethod = true means auto update / false means manual


                var index;
                if (angular.isUndefined($scope.postObj)) {
                    $scope.postObj = $scope.post;
                }
                var count = $scope.formField.fields.length;

                if ($scope.repeater.options.updateMethod) {

                    for (index = 0; index < count; index++) {
                        if ($scope.rows.fields[index].id == $scope.repeater.options.updateField) {
                            $scope.progressValueField = $scope.rows.fields[index];
                            break;
                        }
                    }


                    $scope.$watch('progressValueField', function () {
                        if (isFinite($scope.progressValueField.value)) {
                            $scope.repeater.value = $scope.progressValueField.value;
                        } else {
                            $scope.repeater.value = 0;
                        }

                    }, true);
                }
            }
        }

    }]);


