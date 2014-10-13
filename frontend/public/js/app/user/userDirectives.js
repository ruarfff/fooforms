/* global angular */

angular.module('user')
    .directive('userPhoto', ['$upload', '$log', '_', 'Session', function ($upload, $log, _, Session) {

        return {
            restrict: 'E',

            link: function (scope, elem, attrs, ctrl) {
                scope.onFileSelect = function (selectedFile) {
                    scope.uploadFile = selectedFile[0];
                    scope.doFileUpload();
                };

                scope.doFileUpload = function () {
                    if (scope.uploadFile && (_.isArray(scope.uploadFile) ? scope.uploadFile.length > 0 : true)) {
                        var filesUrl = '/api/files';
                        scope.upload = $upload.upload({
                            url: filesUrl,
                            method: 'POST',
                            // headers: {'header-key': 'header-value'},
                            // withCredentials: true,
                            data: {file: scope.uploadFile}

                        }).progress(function (evt) {
                            scope.uploadProgress = (parseInt(100.0 * evt.loaded / evt.total));
                        }).success(function (data, status, headers, config) {
                            // file is uploaded successfully
                            scope.uploadFile = [];
                            scope.allowUpload = null;
                            if (data.err) {
                                $log.error(data.err);
                            } else {
                                scope.userProfile.photo = filesUrl + '/' + data._id;
                                Session.user.photo = scope.userProfile.photo;
                            }

                        }).error(function (err) {
                            $log.error(err);
                        });
                    }
                }
            },
            replace: true,
            templateUrl: '/partials/profileUploader.html'
        };
    }]);
