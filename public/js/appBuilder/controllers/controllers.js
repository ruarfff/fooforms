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
            "name": "Untitled App-Form",
            "icon": "document.png",
            "description": "My new form based application",
            "menuLabel": "",
            "btnLabel": "New Post",
            "settings": {
                "allowComments": true,
                "status": "draft"
            },
            "fields": []
        };
        $scope.nowEditing = null;
        $scope.dragging = false;


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

        $scope.showBorders = function (show) {
            $scope.dragging = show;
            $scope.nowEditing = null;
            $scope.$apply();
        }

        $scope.showPlaceHolder = function () {
            return $scope.app.fields.length == 0
        }

        $scope.editField = function (field) {
            if (field == 'AppTitle') {
                $scope.nowEditing = null;
                $scope.showFieldSettings = false;
                $scope.showAppSettings = true;
            } else {
                $scope.nowEditing = field;
                $scope.showFieldSettings = true;
                $scope.showAppSettings = false;
            }
            angular.element('#appTabSettings').tab('show')


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
                $scope.selected = selectedItem;
            });
        };

// End Icon Selection -  Modal Dialog

}]);

var ModalInstanceCtrl = function ($scope, $modalInstance, icons) {
    $scope.icons = icons;
    $scope.selected = {
        icon: $scope.icons[0]
    };

    $scope.ok = function () {
        $modalInstance.close($scope.selected.icon);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

};
