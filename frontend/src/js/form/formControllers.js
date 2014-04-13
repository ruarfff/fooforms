angular.module('form').controller('FormsCtrl', ['$scope', 'FormService', 'Forms',
    function ($scope, FormService, Forms) {
        'use strict';
        $scope.formUrl = ''; // Temporary helper variable to view form JSON
        $scope.formName = '';


        FormService.getUserForms(function (err) {
            if(err) {
                console.log(err.toString());
            } else {
                $scope.forms = Forms.forms;
            }
        });

        $scope.hover = function (form) {
            // Shows/hides the delete button on hover
            return form.showOptions = !form.showOptions;
        };

        $scope.viewForm = function (form) {
            $scope.formUrl = form.url;
            $scope.formName = form.name;
        };

        $scope.newForm = function () {
            Forms.resetCurrentForm();
        };

        $scope.updateForm = function (form) {
            Forms.setCurrentForm(form);

        };

        $scope.deleteform = function (form) {
          FormService.deleteForm(form, function (err) {
                if(err) {
                    console.log(err.toString());
                } else {
                    Forms.resetCurrentForm();
                    $scope.forms = Forms.forms;
                }
            });
        };

    }]);

