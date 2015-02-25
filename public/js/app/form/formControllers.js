/* global angular */

angular.module('form').controller('FormCtrl',
    ['$scope', '$location', '$window','$log', 'FormService', 'StoreService', 'Session', 'SweetAlert',
        function ($scope, $location, $window, $log, FormService, StoreService, Session, SweetAlert) {
            'use strict';

            $scope.store = {};
            $scope.categories = [];
            if (Session.user.defaultFolder.forms.length===0){
                $scope.activeCategory = 'Featured';

            }else{
                $scope.activeCategory = 'yourForms';

            }

            StoreService.getStore().then(function (res) {
                $scope.categories = res.data.teams;
            }, function (err) {
                $log.error(err);
            });

            $scope.setCategory = function (category) {
                $scope.activeCategory = category.displayName;
            };

            $scope.installForm = function (form) {
                form.folder = Session.user.defaultFolder._id;
                FormService.createForm(form, function (err, form) {
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
                if (folder == Session.user.defaultFolder._id) {
                    Session.user.defaultFolder.forms.push($scope.form);
                } else {
                    _.forEach(Session.user.teams, function (team) {
                        if (folder == team.defaultFolder._id) {
                            team.defaultFolder.forms.push($scope.form);
                        }
                    });
                }
            };


        }]);

