angular.module('fooforms.form').controller('FormCtrl',
    ['$scope', '$location', '$window', '$log', 'SweetAlert', 'formService', 'storeService', 'session',
        function ($scope, $location, $window, $log, SweetAlert, formService, storeService, session) {
            'use strict';

            $scope.store = {};
            $scope.categories = [];
            if (session.user.defaultFolder.forms.length === 0) {
                $scope.activeCategory = 'Featured';

            } else {
                $scope.activeCategory = 'yourForms';

            }

            storeService.getStore().then(function (res) {
                $scope.categories = res.data.teams;
            }, function (err) {
                $log.error(err);
            });

            $scope.setCategory = function (category) {
                $scope.activeCategory = category.displayName;
            };

            $scope.installForm = function (form) {
                form.folder = session.user.defaultFolder._id;
                formService.createForm(form, function (err, form) {
                    if (err) {
                        SweetAlert.swal('Not Saved!', 'An error occurred trying to install the form.', 'error');
                        $log.error(err);
                    } else {
                        addFormToSessionFolder(form);
                        SweetAlert.swal('Saved!', 'The form has been added to your collection.', 'success');
                        $window.location.reload();
                    }
                });
            };

            var addFormToSessionFolder = function (form) {
                var folder = form.folder;
                if (folder == session.user.defaultFolder._id) {
                    session.user.defaultFolder.forms.push($scope.form);
                } else {
                    _.forEach(session.user.teams, function (team) {
                        if (folder == team.defaultFolder._id) {
                            team.defaultFolder.forms.push($scope.form);
                        }
                    });
                }
            };


        }]);

