/* global angular */

angular.module('formBuilder')






// not used but may be useful some day......

    .directive('compile', function ($compile) {
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
    }).directive('uploader', ['$upload',function($upload) {

        return {
            restrict: 'E',
            scope: {

                formField: '=formField',
                message: '=message',
                onFileSelect: "&onFileSelect",
                doFileUpload: "&doFileUpload"

            },
            link: function(scope, elem, attrs, ctrl) {


                scope.onFileSelect= function(selectedFile){

                    scope.uploadFile = selectedFile[0];


                    scope.doFileUpload();

                };

                scope.doFileUpload = function(){


                    scope.upload = $upload.upload({
                        url: '/api/file', //upload.php script, node.js route, or servlet url
                        // method: POST or PUT,
                        // headers: {'header-key': 'header-value'},
                        // withCredentials: true,
                        data: {file: scope.uploadFile}

                    }).progress(function(evt) {
                        scope.formField.progress = (parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function(data, status, headers, config) {
                        // file is uploaded successfully
                        scope.uploadFile = [];
                        scope.allowUpload = null;
                        if (data.err){
                            setMessage(true,'File Failed Validation',data.err,'alert-danger');

                        }else{
                            scope.formField.value = data;

                        }

                    }).error(function(err){
                        alert(err);
                    });



                }

            },
            replace: false,
            templateUrl: '/partials/uploader.html'
        };

    }]).directive('profileUploader', ['$upload',function($upload) {

        return {
            restrict: 'E',
            scope: {

                user: '=user',
                message: '=message',
                onFileSelect: "&onFileSelect",
                doFileUpload: "&doFileUpload"

            },
            link: function(scope, elem, attrs, ctrl) {


                scope.onFileSelect= function(selectedFile){

                    scope.uploadFile = selectedFile[0];


                    scope.doFileUpload();

                };

                scope.doFileUpload = function(){


                    scope.upload = $upload.upload({
                        url: '/api/file', //upload.php script, node.js route, or servlet url
                        // method: POST or PUT,
                        // headers: {'header-key': 'header-value'},
                        // withCredentials: true,
                        data: {file: scope.uploadFile}

                    }).progress(function(evt) {
                        //scope.formField.progress = (parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function(data, status, headers, config) {
                        // file is uploaded successfully
                        scope.uploadFile = [];
                        scope.allowUpload = null;
                        if (data.err){
                            setMessage(true,'File Failed Validation',data.err,'alert-danger');

                        }else{
                            scope.user.photo= data._id;

                        }

                    }).error(function(err){
                        alert(err);
                    });



                }

            },
            replace: false,
            templateUrl: '/partials/profileUploader.html'
        };

    }]);