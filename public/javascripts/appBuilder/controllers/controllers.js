'use strict';

/* Controllers */

angular.module( 'appBuilder.controllers', [] ).
    controller( 'fieldsCtrl', ['$scope','$http', 'DragDropHandler' ,function ($scope, $http ,DragDropHandler) {



        $http.get('/javascripts/appBuilder/app/inputTypes.json').success(function(data) {


            $scope.inputTypes = data;

        });

        $scope.appFields=[];
        $scope.nowEditing = 0;


        $scope.updateObjects = function(from, to) {
            var itemIds = _.pluck($scope.appFields, 'id');
            console.log(itemIds);
        };

        $scope.createObject = function(object, to) {
            var newItem = angular.copy(object);
            newItem.id = Math.ceil(Math.random() * 1000);
            DragDropHandler.addObject(newItem, $scope.appFields, to);
        };

        $scope.deleteItem = function(itemId) {
            $scope.appFields = _.reject($scope.appFields, function(appField) {
                return appField.id == itemId;
            });
        }

        $scope.showPlaceHolder = function(){
            return $scope.appFields.length == 0
        }

        $scope.editField = function(appField, $event){
            $scope.nowEditing=appField;
            angular.element('#appTabSettings').tab('show');
            var xx=$event;
        }


    }] )
    .controller( 'formCtrl', ['$scope','$http', function ($scope, $http) {


    }] );
