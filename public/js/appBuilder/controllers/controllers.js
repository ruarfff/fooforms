'use strict';

/* Controllers */

fooformsApp.controller('fieldsCtrl', ['$scope', '$http', 'DragDropHandler' , '$modal', function ($scope, $http, DragDropHandler, $modal) {


    $http.get('/js/appBuilder/app/inputTypes.json').success(function (data) {


        $scope.inputTypes = data.inputTypes;
        $scope.icons = data.icons;

    });
    // the main object to store the app data
    $scope.app = {
        "id": Math.ceil(Math.random() * 1000),
        "name": "Untitled App",
        "icon": "/assets/icons/color/document.png",
        "description": "My new app - it's totally awesome!",
        "menuLabel": "Untitled App",
        "btnLabel": "New Post",
        "settings": {
            "allowComments": true,
            "status": "draft",
            "displayOptions": [
                {
                    "feed": true,
                    "grid": true,
                    "card": true
                }
            ]
        },
        "fields": [],
        "version": 1,
        "created": new Date(),
        "lastModified": new Date(),
        "owner": ""

    };
    // some booleans to help track what we are editing, which tabs to enable, etc.
    // used in ng-show in appBuilderMenu
    $scope.nowEditing = null;
    $scope.nowSubEditing = null;
    $scope.showFieldSettings = false;
    $scope.showGroupSettings = false;
    $scope.showAppSettings = false;
    $scope.dragging = false;

    //following are all called from the directives droppable or subdroppable

    $scope.updateObjects = function (from, to) {
        var itemIds = _.pluck($scope.app.fields, 'id');
        console.log(itemIds);
        $scope.dragging = false;
    };

    $scope.createObject = function (object, to) {
        var newItem = angular.copy(object);
        newItem.id = Math.ceil(Math.random() * 1000);
        DragDropHandler.addObject(newItem, $scope.app.fields, to);
        $scope.dragging = false;
    };
    $scope.deleteItem = function (itemId) {
        $scope.app.fields = _.reject($scope.app.fields, function (field) {
            return field.id == itemId;
        });
    }
    $scope.createSubObject = function (object, repeatBox, to) {
        var newItem = angular.copy(object);
        newItem.id = Math.ceil(Math.random() * 1000);
        DragDropHandler.addObject(newItem, $scope.app.fields[repeatBox].fields, to);
        $scope.dragging = false;
    };

    $scope.updateSubObjects = function (repeatBox, from, to) {
        var itemIds = _.pluck($scope.app.fields, 'id');
        console.log(itemIds);
        $scope.dragging = false;
    };
    $scope.deleteSubItem = function (itemId) {
        $scope.app.fields[$scope.nowEditing].fields = _.reject($scope.app.fields[$scope.nowEditing].fields, function (field) {
            return field.id == itemId;
        });
    }
// Used to add options to selects, radios, i.e. Single selection
    $scope.addOption = function ($index) {
        if ($scope.nowSubEditing == null) {
            $scope.app.fields[$scope.nowEditing].options.splice($index + 1, 0, {"label": ""});
        } else {
            $scope.app.fields[$scope.nowEditing].fields[$scope.nowSubEditing].options.splice($index + 1, 0, {"label": ""});
        }
    }
// Used to add options to checkboxes i.e. Multiple selection
    $scope.addOptionObject = function ($index) {
        if ($scope.nowSubEditing == null) {
            $scope.app.fields[$scope.nowEditing].options.splice($index + 1, 0, {"label": "", "selected": false});
        } else {
            $scope.app.fields[$scope.nowEditing].fields[$scope.nowSubEditing].options.splice($index + 1, 0, {"label": "", "selected": false});
        }
    }

// removes options from selects, radios, etc....
    $scope.deleteOption = function ($index) {
        if ($scope.nowSubEditing == null) {
            $scope.app.fields[$scope.nowEditing].options.splice($index, 1);
        } else {
            $scope.app.fields[$scope.nowEditing].fields[$scope.nowSubEditing].options.splice($index, 1);
        }
    };

    // dragging has started -  null nowEditing and show borders on all formfields to aid with dropping.
    $scope.showBorders = function (show) {
        $scope.dragging = show;
        $scope.nowEditing = null;
        $scope.nowSubEditing = null;
        $scope.$apply();
    }

    // should we show the default placeholder - i.e. - there are no formfields
    $scope.showPlaceHolder = function (container) {
        return container.length == 0
    }

    // switch on/off the various option panels and track / highlight the selected form-fields
    $scope.editField = function (fieldId, subFieldId, objectType, $event) {
        switch (objectType) {
            case 'Application':
                $scope.nowEditing = null;
                $scope.nowSubEditing = null;
                $scope.showFieldSettings = false;
                $scope.showGroupSettings = false;
                $scope.showAppSettings = true;
                break;
            case 'Field' :
                $scope.nowEditing = fieldId;
                $scope.nowSubEditing = subFieldId; //null
                $scope.showFieldSettings = true;
                $scope.showGroupSettings = false;
                $scope.showAppSettings = false;
                break;
            case 'Group' :
                $scope.nowEditing = fieldId;
                $scope.nowSubEditing = subFieldId;
                $scope.showFieldSettings = false;
                $scope.showGroupSettings = true;
                $scope.showAppSettings = false;
                break;
            default :
                $scope.nowEditing = null;
                $scope.nowSubEditing = null;
                $scope.showFieldSettings = false;
                $scope.showGroupSettings = false;
                $scope.showAppSettings = false;
                break;

        }
        $event.stopPropagation();
        angular.element('#appTabSettings').tab('show')


    }

    // Set Calculation Field Options
    $scope.setCalculationField = function (selectedItem) {

        if ($scope.nowSubEditing == null) {
            $scope.app.fields[$scope.nowEditing].options.field1.item = selectedItem;
        } else {
            $scope.app.fields[$scope.nowEditing].options.field1.item = "value";
        }
    }


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
            $scope.app.icon = selectedItem;
        });
    };

// End Icon Selection -  Modal Dialog

}])
;

var ModalInstanceCtrl = function ($scope, $modalInstance, icons) {
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
