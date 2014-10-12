/* global angular */

angular.module('user')
    .directive('profilePicture', ['$upload', '$log', function ($upload, $log) {

        return {
            restrict: 'E',
            scope: {

                formField: '=formField',
                message: '=message',
                onFileSelect: "&onFileSelect",
                doFileUpload: "&doFileUpload"

            },
            link: function (scope, elem, attrs, ctrl) {

                ctrl.$setValidity('error', true);

                scope.onFileSelect = function (selectedFile) {

                    scope.uploadFile = selectedFile[0];


                    scope.doFileUpload();

                };

                scope.doFileUpload = function () {

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
                        if (data.err) {
                            $log.error(data.err);
                            ctrl.$setValidity('error', false);
                        } else {
                            scope.formField.value = data;
                        }

                    }).error(function (err) {
                        $log.error(err);
                        ctrl.$setValidity('error', false);
                    });
                }
            },
            replace: false,
            templateUrl: '/partials/uploader.html'
        };
    }])
