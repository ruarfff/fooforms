/* global angular */

angular.module('folder')

    .controller('FolderCtrl',
    ['$scope', '$route', '$log', '$routeParams', 'Restangular', 'FolderService', 'Folders', 'Forms', 'FormService',
        function ($scope, $route, $log, $routeParams, Restangular, FolderService, Folders, Forms, FormService) {
            "use strict";

            $scope.folder = {};
            $scope.forms = [];

            var folder = Restangular.one('folders', $routeParams.folder);

            folder.get().then(

            function (folder) {
                $scope.folder = folder;

                Restangular.one('folders', folder._id).getList('forms').then(function (forms) {
                    $scope.forms = forms;
                });

                /**FolderService.getFolderForms($scope.folder, function (err) {
                    if (err) {
                        $log.error(err.toString());
                    } else {
                        $scope.forms = Forms.forms;
                    }
                });**/
            },
            function (err) {
                $log.error(err.toString());
            });

            $scope.updateForm = function (form) {
                Forms.setCurrentForm(form);
            };


            $scope.tabs = [
                {name: "Forms", active: true},
                {name: "Settings", active: false}
            ];
            $scope.nowEditing = 0;
            $scope.showBorders = function () {

            };

            // Set up a new folder object to help with folder creation
            $scope.newFolder = {};
            $scope.newTab = {};

            // Create a new tab
            $scope.createTab = function (tab) {
                $scope.tabs.push(angular.copy(tab));
                $scope.$apply();
                angular.element('#' + tab.name).tab('show');
                $scope.newTab = {};
            };

            var folderUpdateCallback = function () {

            };

            // Create a new folder
            $scope.createFolder = function (folder) {
                FolderService.createFolder(folder, folderUpdateCallback);
            };

            // Update and existing folder
            $scope.updateFolder = function (folder) {
                FolderService.updateFolder(folder, folderUpdateCallback);
            };


            // Delete and existing folder
            $scope.deleteFolder = function (folder) {
                FolderService.deleteFolder(folder, folderUpdateCallback);
            };

            $scope.addFormToFolder = function (folder, form) {
                FolderService.addFormToFolder(folder, form, folderUpdateCallback);
            };

            $scope.removeFormFromFolder = function (folder, form) {
                FolderService.removeFormFromFolder(folder, form, folderUpdateCallback);
            };

            $scope.addMemberToFolder = function (folder, user) {
                FolderService.addMemberToFolder(folder, user, folderUpdateCallback);
            };

            $scope.addMemberWithWritePermissionsToFolder = function (folder, user) {
                FolderService.addMemberWithWritePermissionsToFolder(folder, user, folderUpdateCallback);
            };

            $scope.removeMemberFromFolder = function (folder, user) {
                FolderService.removeMemberFromFolder(folder, user, folderUpdateCallback);
            };

            $scope.removeMemberWritePermissionsFromFolder = function (folder, user) {
                FolderService.removeMemberWritePermissionsFromFolder(folder, user, folderUpdateCallback);
            };

            // Add a Form to a  folder
            $scope.addFormToFolder = function (folder, form) {
                FolderService.addFormToFolder(folder, form, folderUpdateCallback);
            };

        }]);

