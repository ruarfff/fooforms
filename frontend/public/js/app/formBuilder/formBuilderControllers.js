/* global angular */

angular.module('formBuilder').controller('FormBuilderCtrl',
    ['$log', '$routeParams', '$scope', '$http', '$modal', '$filter', 'Restangular', 'SweetAlert', 'FormService', 'Session', '_',
        function ($log, $routeParams, $scope, $http, $modal, $filter, Restangular, SweetAlert, FormService, Session, _) {
            "use strict";

            $scope.userInputTypes = [];
            $scope.numberInputTypes = [];
            $scope.fileInputTypes = [];
            $scope.advancedInputTypes = [];
            $scope.standardInputTypes = [];

            $http.get('/js/formBuilder/inputTypes.json').success(function (data) {

                $scope.inputTypes = angular.copy(data.inputTypes);
                $scope.formEventHolder = angular.copy(data.events);

                $scope.icons = data.icons;

                $scope.inputTypesRefresh = angular.copy($scope.inputTypes);

                $scope.userInputTypes = $filter('filterTypes')($scope.inputTypesRefresh, 'user');
                $scope.numberInputTypes = $filter('filterTypes')($scope.inputTypesRefresh, 'number');
                $scope.fileInputTypes = $filter('filterTypes')($scope.inputTypesRefresh, 'files');
                $scope.advancedInputTypes = $filter('filterTypes')($scope.inputTypesRefresh, 'advanced');
                $scope.standardInputTypes = $filter('filterTypes')($scope.inputTypesRefresh, 'standard');
                $scope.resetEventTypes();

                var name = $routeParams.name;
                var owner = _.find(Session.user.organisations, {displayName: name}) || _.find(Session.user.teams, {displayName: name}) || Session.user.displayName;

                var folder;
                if (owner && owner === Session.user.displayName) {
                    folder = Session.user.defaultFolder;
                } else if (owner) {
                    folder = owner.defaultFolder || owner.folders[0];
                }
                var formName = $routeParams.form;

                if (formName) {
                    if (folder) {
                        $scope.form = _.find(folder.forms, {displayName: formName});
                    }
                } else if (folder) {
                    $scope.form = FormService.getFormTemplateObject();
                    $scope.form.folder = folder._id || folder;
                }
                if (!$scope.form) {
                    window.location.href = '/404';
                }
            });


            $scope.resetInputTypes = function () {
                $scope.inputTypesRefresh = angular.copy($scope.inputTypes);

                $scope.userInputTypes = $filter('filterTypes')($scope.inputTypesRefresh, 'user');
                $scope.numberInputTypes = $filter('filterTypes')($scope.inputTypesRefresh, 'number');
                $scope.fileInputTypes = $filter('filterTypes')($scope.inputTypesRefresh, 'files');
                $scope.advancedInputTypes = $filter('filterTypes')($scope.inputTypesRefresh, 'advanced');
                $scope.standardInputTypes = $filter('filterTypes')($scope.inputTypesRefresh, 'standard');
            };

            $scope.resetEventTypes = function () {
                $scope.formEvents = angular.copy($scope.formEventHolder);
            }
            ;

            // some booleans to help track what we are editing, which tabs to enable, etc.
            // used in ng-show in formBuilderMenu
            $scope.nowEditing = null;
            $scope.dropped = null;
            $scope.nowSubEditing = null;
            $scope.showFieldSettings = false;
            $scope.showGroupSettings = false;
            $scope.showFormSettings = false;
            $scope.dragging = false;

            $scope.formFieldx = [];


            $scope.sortableOptions = {
                connectWith: ".connected-apps-container, .repeat-apps-container",
                cursorAt: { left: 15, top: 15},
                "opacity": 0.7,
                distance: 5, forceHelperSize: true,
                helper: "clone",
                placeholder: 'ui-sortable-placeholder',
                appendTo: 'body',
                zIndex: 99999999,
                scroll: true,
                start: function (e, ui) {
                    if (ui.item[0].className.indexOf("fieldObject") > -1) {
                        // It's a new field object pulled from the menu
                        ui.placeholder.height(ui.helper.outerHeight());
                        ui.placeholder.width('100%');
                    } else {
                        //It's an exiting object on the form
                        ui.placeholder.height(ui.helper.outerHeight());
                        ui.placeholder.width(ui.helper.outerWidth());
                    }
                },
                stop: function (e, ui) {
                    $scope.$apply(function () {
                        $scope.resetInputTypes();
                        // Was something dropped
                        if (ui.item.sortable.hasOwnProperty('droptarget')) {
                            // Are we dropping into a repeatBox or not?
                            if (ui.item.sortable.droptarget[0].className.indexOf("repeat-apps-container") > -1) {
                                $scope.dropped = $scope.nowSubEditing = ui.item.sortable.dropindex;
                                $scope.form.fields[$scope.nowEditing].fields[$scope.nowSubEditing].id = new Date().getTime();
                            } else {
                                $scope.dropped = $scope.nowEditing = ui.item.sortable.dropindex;
                                $scope.form.fields[$scope.nowEditing].id = new Date().getTime();
                            }
                        }


                        $scope.lastChanged();
                    });
                    // if the element is removed from the first container

                }
            };


            $scope.eventSortableOptions = {
                connectWith: ".connected-events-container",
                cursorAt: { left: 15, top: 15},
                "opacity": 0.7,
                distance: 5, forceHelperSize: true,
                helper: "clone",
                appendTo: 'body',
                zIndex: 99999999,
                scroll: true,
                stop: function (e, ui) {
                    $scope.$apply(function () {
                        $scope.resetEventTypes();
                        $scope.dropped = $scope.nowEditing = ui.item.sortable.dropindex;
                        $scope.form.formEvents[$scope.nowEditing].id = new Date().getTime();
                        $scope.lastChanged();
                    });
                    // if the element is removed from the first container


                }

            };

            $scope.lastChanged = function () {
                $scope.form.lastChanged = new Date().getTime();
            };


            //Delete form Items


            $scope.deleteItem = function (itemId) {
                $scope.form.fields = _.reject($scope.form.fields, function (field) {
                    return field.id === itemId;
                });
            };

            $scope.deleteSubItem = function (itemId) {
                $scope.form.fields[$scope.nowEditing].fields = _.reject($scope.form.fields[$scope.nowEditing].fields, function (field) {
                    return field.id === itemId;
                });
            };

            $scope.deleteEvent = function (delEvent) {
                $scope.form.formEvents = _.reject($scope.form.formEvents, function (formEvent) {
                    return formEvent.id === delEvent.id;
                });
            };

            // Drag Drop Events
            $scope.updateEvents = function (from, to) {

                $scope.dragging = false;
            };


            // Used to add options to selects, radios, i.e. Single selection
            $scope.addOption = function ($index) {
                if ($scope.nowSubEditing === null) {
                    $scope.form.fields[$scope.nowEditing].options.splice($index + 1, 0, {"label": ""});
                } else {
                    $scope.form.fields[$scope.nowEditing].fields[$scope.nowSubEditing].options.splice($index + 1, 0, {"label": ""});
                }
            };
            // Used to add options to checkboxes i.e. Multiple selection
            $scope.addOptionObject = function ($index) {
                if ($scope.nowSubEditing === null) {
                    $scope.form.fields[$scope.nowEditing].options.splice($index + 1, 0, {"label": "", "selected": false});
                } else {
                    $scope.form.fields[$scope.nowEditing].fields[$scope.nowSubEditing].options.splice($index + 1, 0, {"label": "", "selected": false});
                }
            };

            // removes options from selects, radios, etc....
            $scope.deleteOption = function ($index) {
                if ($scope.nowSubEditing === null) {
                    $scope.form.fields[$scope.nowEditing].options.splice($index, 1);
                } else {
                    $scope.form.fields[$scope.nowEditing].fields[$scope.nowSubEditing].options.splice($index, 1);
                }
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
                        $scope.showEventSettings = false;
                        break;
                    case 'Field' :
                        $scope.nowEditing = fieldId;
                        $scope.nowSubEditing = subFieldId; //null
                        $scope.showFieldSettings = true;
                        $scope.showGroupSettings = false;
                        $scope.showFormSettings = false;
                        $scope.showEventSettings = false;
                        break;
                    case 'Group' :
                        $scope.nowEditing = fieldId;
                        $scope.nowSubEditing = subFieldId;
                        $scope.showFieldSettings = false;
                        $scope.showGroupSettings = true;
                        $scope.showFormSettings = false;
                        $scope.showEventSettings = false;
                        break;
                    case 'Event' :
                        $scope.nowEditing = fieldId;
                        $scope.nowSubEditing = subFieldId;
                        $scope.showFieldSettings = false;
                        $scope.showGroupSettings = true;
                        $scope.showFormSettings = false;
                        $scope.showEventSettings = true;
                        break;
                    default :
                        $scope.nowEditing = null;
                        $scope.nowSubEditing = null;
                        $scope.showFieldSettings = false;
                        $scope.showGroupSettings = false;
                        $scope.showFormSettings = false;
                        $scope.showEventSettings = false;
                        break;

                }
                $event.stopPropagation();
                angular.element('#formTabSettings').tab('show');

            };

            // Set Calculation Field Options
            $scope.setCalculationField = function (selectedItem) {

                if ($scope.nowSubEditing === null) {
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


            //List Selection -  Modal Dialog
            $scope.openListManager = function () {

                var modalInstance = $modal.open({
                    templateUrl: '/partials/listManager.html',
                    controller: ModalListManagerCtrl,
                    size: "modal-lg",
                    resolve: {
                        list: function () {
                            return $scope.form.fields[$scope.nowEditing].list;
                        }
                    }
                });

                modalInstance.result.then(function (list) {
                    $scope.form.fields[$scope.nowEditing].list = list;
                });
            };

            $scope.openEditor = function (field) {

                var modalInstance = $modal.open({
                    templateUrl: '/partials/htmlEditor.html',
                    controller: ModalEditorCtrl,
                    size: "modal-lg",
                    resolve: {
                        fieldData: function () {
                            return $scope.form.settings[field];
                        }
                    }
                });

                modalInstance.result.then(function (returnedContent) {
                    $scope.form.settings[field] = returnedContent;
                });
            };

            // End Icon Selection -  Modal Dialog

            $scope.saveForm = function () {
                if ($scope.form._id) {
                    FormService.updateForm($scope.form, function (err, form) {
                        if (err) {
                            SweetAlert.swal('Not Updated!', 'An error occurred trying to update the form.', 'error');
                            $log.error(err);
                        } else {
                            $scope.form = form;

                            var oldForm = _.find(Session.user.forms, { '_id': $scope.form._id });
                            var index = Session.user.defaultFolder.forms.indexOf(oldForm);
                            if (~index) {
                                Session.user.defaultFolder.forms = Session.user.defaultFolder.forms.push[$scope.form];
                            } else {
                                Session.user.defaultFolder.forms[index] = $scope.form;
                            }
                            SweetAlert.swal('Saved!', 'Your form has been updated.', 'success');
                        }
                    });
                } else {
                    FormService.createForm($scope.form, function (err, form) {
                        if (err) {
                            SweetAlert.swal('Not Saved!', 'An error occurred trying to create the form.', 'error');
                            $log.error(err);
                        } else {
                            $scope.form = form;
                            Session.user.defaultFolder.forms.push($scope.form);
                            SweetAlert.swal('Saved!', 'Your form has been created.', 'success');

                        }
                    });
                }
            };

            $scope.deleteForm = function () {
                SweetAlert.swal({   title: 'Are you sure?', text: 'Your will not be able to recover this form!',
                        type: 'warning',
                        showCancelButton: true, confirmButtonColor: '#DD6B55',
                        confirmButtonText: 'Yes, delete it!', closeOnConfirm: false },
                    function () {
                        FormService.deleteForm($scope.form, function (err) {
                            if (err) {
                                SweetAlert.swal('Not Deleted!', 'An error occurred trying to delete the form.', 'error');
                                $log.error(err);
                            } else {
                                var oldForm = _.find(Session.user.defaultFolder.forms, { '_id': $scope.form._id });
                                var index = Session.user.defaultFolder.forms.indexOf(oldForm);
                                if (index > -1) {
                                    Session.user.defaultFolder.forms.splice(index, 1);
                                }
                                $scope.form = FormService.getFormTemplateObject();
                                SweetAlert.swal('Deleted!', 'Your form has been deleted.', 'success');
                            }
                        });
                    });

            };

            $scope.copyForm = function () {
                SweetAlert.swal({   title: 'Are you sure?', text: 'Your will lose any unsaved changes on the current form but they will be applied to the copy.',
                    type: 'warning',
                    showCancelButton: true, confirmButtonColor: '#DD6B55',
                    confirmButtonText: 'Yes, copy it!',
                    closeOnConfirm: false }, function () {
                    SweetAlert.swal('Done!', 'Form Copied', 'success');
                    var newForm = angular.copy($scope.form);
                    if (newForm._id) {
                        delete newForm._id;
                    }
                    $scope.form = newForm;
                });
            };

            $scope.dontSaveForm = function () {
                SweetAlert.swal({   title: 'Are you sure?', text: 'Your will lose any unsaved changes on the form.',
                    type: 'warning',
                    showCancelButton: true, confirmButtonColor: '#DD6B55',
                    confirmButtonText: 'Yes, cancel it!'}, function () {
                    $scope.form = FormService.getFormTemplateObject();
                    $scope.$apply();
                });
            }

        }
    ])
;


var ModalEditorCtrl = function ($scope, $modalInstance, fieldData) {
    'use strict';

    $scope.fieldDatax = angular.copy(fieldData);

    $scope.editorOptions = {
        lineNumbers: true,
        theme: 'twilight',
        lineWrapping: true,
        mode: 'xml',
        onLoad: function (_cm) {

            // HACK to have the codemirror instance in the scope...

            _cm.setOption("mode", 'xml');
            _cm.refresh();


        }
    };

    $scope.ok = function (datax) {
        $modalInstance.close(datax);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

};


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

var ModalListManagerCtrl = function ($scope, $modalInstance, list, $upload) {
    'use strict';

    $scope.listData = angular.copy(list);


    $scope.saveList = function () {

        $modalInstance.close($scope.listData);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.uploadFile = [];
    $scope.uploadProgress = 50;
    $scope.message = {show: false};


    $scope.setMessage = function (show, title, body, style) {

        $scope.message.show = show;
        $scope.message.title = title;
        $scope.message.body = body;
        $scope.message.alertStyle = style;

    };

    $scope.browse = function () {

        angular.element('#uploadFile').click()

    };

    $scope.onFileSelect = function (selectedFile) {
        $scope.uploadProgress = 0;
        $scope.setMessage(false);

        $scope.uploadFile = selectedFile[0];

        if ($scope.uploadFile.type != 'text/csv') {

            $scope.allowUpload = false;
            $scope.setMessage(true, 'Invalid File Format', 'FOOFORMS expects a .csv file. Please ensure you have saved your file in .csv format', 'alert-danger');
        } else {

            $scope.allowUpload = true;
            $scope.doFileUpload();
        }
        angular.element('#browseBtn').blur();


    };

    $scope.doFileUpload = function () {
        $scope.uploadProgress = 1;

        $scope.upload = $upload.upload({
            url: '/file', //upload.php script, node.js route, or servlet url
            // method: POST or PUT,
            // headers: {'header-key': 'header-value'},
            // withCredentials: true,
            data: {file: $scope.uploadFile}

        }).progress(function (evt) {
            $scope.uploadProgress = (parseInt(100.0 * evt.loaded / evt.total));
        }).success(function (data, status, headers, config) {
            // file is uploaded successfully
            $scope.uploadFile = [];
            $scope.allowUpload = null;
            if (data.err) {
                $scope.setMessage(true, 'CSV File Failed Validation', data.err, 'alert-danger');

            } else {
                $scope.listData.columns = data[0].items;
                data.splice(0, 1);
                $scope.listData.rows = data;
            }

        }).error(function (err) {
            alert(err);
        });
    }

};
