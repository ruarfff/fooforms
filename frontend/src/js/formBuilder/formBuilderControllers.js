fooformsApp.controller('FieldsCtrl',
    ['$scope', '$http', '$modal', 'DragDropHandler', 'Restangular', 'FormService', 'Forms', 'FolderService', 'Folders',
        function ($scope, $http, $modal, DragDropHandler, Restangular, FormService, Forms, FolderService, Folders) {

            "use strict";
            $http.get('/js/formBuilder/inputTypes.json').success(function (data) {

                $scope.inputTypes = data.inputTypes;
                $scope.icons = data.icons;
                $scope.formEvents = data.events;

            });

            FolderService.getFolders(function (err) {
                if (!err) {
                    $scope.folders = Folders.folders;
                    $scope.privateFolders = Folders.privateFolders;
                    $scope.publicFolders = Folders.publicFolders;
                }
            });
            // the main object to store the form data
            $scope.form = Forms.getCurrentForm();
            // some booleans to help track what we are editing, which tabs to enable, etc.
            // used in ng-show in formBuilderMenu
            $scope.nowEditing = null;
            $scope.nowSubEditing = null;
            $scope.showFieldSettings = false;
            $scope.showGroupSettings = false;
            $scope.showFormSettings = false;
            $scope.dragging = false;

            //following are all called from the directives droppable or subdroppable

            $scope.updateObjects = function (from, to) {
                var itemIds = _.pluck($scope.form.fields, 'id');
                console.log(itemIds);
                $scope.dragging = false;
            };

            $scope.createObject = function (object, to) {
                var newItem = angular.copy(object);
                newItem.id = Math.ceil(Math.random() * 1000);
                DragDropHandler.addObject(newItem, $scope.form.fields, to);
                $scope.dragging = false;
            };
            $scope.deleteItem = function (itemId) {
                $scope.form.fields = _.reject($scope.form.fields, function (field) {
                    return field.id == itemId;
                });
            }
            $scope.createSubObject = function (object, repeatBox, to) {
                var newItem = angular.copy(object);
                newItem.id = Math.ceil(Math.random() * 1000);
                DragDropHandler.addObject(newItem, $scope.form.fields[repeatBox].fields, to);
                $scope.dragging = false;
            };

            $scope.updateSubObjects = function (repeatBox, from, to) {
                var itemIds = _.pluck($scope.form.fields, 'id');
                console.log(itemIds);
                $scope.dragging = false;
            };
            $scope.deleteSubItem = function (itemId) {
                $scope.form.fields[$scope.nowEditing].fields = _.reject($scope.form.fields[$scope.nowEditing].fields, function (field) {
                    return field.id == itemId;
                });
            }

// Drag Drop Events
            $scope.updateEvents = function (from, to) {

                $scope.dragging = false;
            };

            $scope.createEvent = function (object, to) {
                var newItem = angular.copy(object);
                newItem.id = Math.ceil(Math.random() * 1000);
                DragDropHandler.addObject(newItem, $scope.form.formEvents, to);
                $scope.dragging = false;
            };


// Used to add options to selects, radios, i.e. Single selection
            $scope.addOption = function ($index) {
                if ($scope.nowSubEditing == null) {
                    $scope.form.fields[$scope.nowEditing].options.splice($index + 1, 0, {"label": ""});
                } else {
                    $scope.form.fields[$scope.nowEditing].fields[$scope.nowSubEditing].options.splice($index + 1, 0, {"label": ""});
                }
            };
// Used to add options to checkboxes i.e. Multiple selection
            $scope.addOptionObject = function ($index) {
                if ($scope.nowSubEditing == null) {
                    $scope.form.fields[$scope.nowEditing].options.splice($index + 1, 0, {"label": "", "selected": false});
                } else {
                    $scope.form.fields[$scope.nowEditing].fields[$scope.nowSubEditing].options.splice($index + 1, 0, {"label": "", "selected": false});
                }
            };

// removes options from selects, radios, etc....
            $scope.deleteOption = function ($index) {
                if ($scope.nowSubEditing == null) {
                    $scope.form.fields[$scope.nowEditing].options.splice($index, 1);
                } else {
                    $scope.form.fields[$scope.nowEditing].fields[$scope.nowSubEditing].options.splice($index, 1);
                }
            };

            // dragging has started -  null nowEditing and show borders on all formfields to aid with dropping.
            $scope.showBorders = function (show) {
                $scope.dragging = show;
                $scope.nowEditing = null;
                $scope.nowSubEditing = null;
                $scope.$apply();
            };

            // should we show the default placeholder - i.e. - there are no formfields
            $scope.showPlaceHolder = function (container) {
                return container.length === 0;
            };

            // switch on/off the various option panels and track / highlight the selected form-fields
            $scope.editField = function (fieldId, subFieldId, objectType, $event) {
                switch (objectType) {
                    case 'Form':
                        $scope.nowEditing = null;
                        $scope.nowSubEditing = null;
                        $scope.showFieldSettings = false;
                        $scope.showGroupSettings = false;
                        $scope.showFormSettings = true;
                        break;
                    case 'Field' :
                        $scope.nowEditing = fieldId;
                        $scope.nowSubEditing = subFieldId; //null
                        $scope.showFieldSettings = true;
                        $scope.showGroupSettings = false;
                        $scope.showFormSettings = false;
                        break;
                    case 'Group' :
                        $scope.nowEditing = fieldId;
                        $scope.nowSubEditing = subFieldId;
                        $scope.showFieldSettings = false;
                        $scope.showGroupSettings = true;
                        $scope.showFormSettings = false;
                        break;
                    default :
                        $scope.nowEditing = null;
                        $scope.nowSubEditing = null;
                        $scope.showFieldSettings = false;
                        $scope.showGroupSettings = false;
                        $scope.showFormSettings = false;
                        break;

                }
                $event.stopPropagation();
                angular.element('#formTabSettings').tab('show');

            };

            // Set Calculation Field Options
            $scope.setCalculationField = function (selectedItem) {

                if ($scope.nowSubEditing == null) {
                    $scope.form.fields[$scope.nowEditing].options.field1.item = selectedItem;
                } else {
                    $scope.form.fields[$scope.nowEditing].options.field1.item = "value";
                }
            };

            $scope.openEventTabs = function () {
                angular.element('#eventsTab').tab('show');
                angular.element('#sideEventTab').tab('show');
            };
            $scope.openDesignTab = function () {
                angular.element('#designTab').tab('show');
            };

//Icon Selection -  Modal Dialog
            $scope.open = function () {

                var modalInstance = $modal.open({
                    templateUrl: '/partials/icons.html',
                    controller: ModalInstanceCtrl,
                    resolve: {
                        icons: function () {
                            return $scope.icons;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    $scope.form.icon = selectedItem;
                });
            };

// End Icon Selection -  Modal Dialog

            $scope.saveForm = function (formToSave) {
                console.log(JSON.stringify(formToSave));
                if (formToSave._id) {
                    FormService.updateForm(formToSave, function (err) {
                        if (err) {
                            console.log(err.toString());
                        } else {
                            $scope.form = Forms.findById(formToSave._id);
                            Forms.setCurrentForm($scope.form);
                        }
                    });
                } else {
                    FormService.createForm(formToSave, function (err, formId) {
                        if (err) {
                            console.log(err.toString());
                        } else {
                            $scope.form = Forms.findById(formId);
                            Forms.setCurrentForm($scope.form);
                        }
                    });
                }
            };

            $scope.newForm = function (previousForm) {
                // TODO: Check if there are unsaved changes and warn
                Forms.resetCurrentForm();
                $scope.form = Forms.getCurrentForm();
            };

        }])
;

var ModalInstanceCtrl = function ($scope, $modalInstance, icons) {
    'use strict';

    $scope.icons = icons;
    $scope.chosen = {
        icon: $scope.icons[0]
    };

    $scope.ok = function () {
        $modalInstance.close($scope.chosen.icon);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

};
