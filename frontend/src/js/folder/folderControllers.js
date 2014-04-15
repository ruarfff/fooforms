/* global angular */

angular.module('folder').controller('FolderCtrl', function ($scope, $route, Restangular, FolderService, Folders, Forms, FormService) {
    "use strict";

    $scope.folder = Folders.getCurrentFolder();


    var folderUpdateCalback = function(err) {
        if(!err) {
            $scope.folders = Folders.folders;
            $scope.privateFolders = Folders.privateFolders;
            $scope.publicFolders = Folders.publicFolders;
        }
    };
    FolderService.getFolders(folderUpdateCalback);

    $scope.updateForm = function (form) {
        Forms.setCurrentForm(form);
        Posts.activePost = null;
    };

    FormService.getUserForms(function (err) {
        if(err) {
            $log.error(err.toString());
        } else {
            $scope.forms = Forms.forms;
        }
    });


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

    // Create a new folder
    $scope.createTab = function (tab) {
        $scope.tabs.push(angular.copy(tab));
        $scope.$apply();
        angular.element('#' + tab.name).tab('show');
        $scope.newTab = {};
    };


    // Create a new folder
    $scope.createFolder = function (folder) {
        FolderService.createFolder(folder, folderUpdateCalback);
    };

    // Update and existing folder
    $scope.updateFolder = function (folder) {
        FolderService.updateFolder(folder, folderUpdateCalback);
    };


    // Delete and existing folder
    $scope.deleteFolder = function (folder) {
        FolderService.deleteFolder(folder, folderUpdateCalback);
    };

    // Add a Form to a  folder
    $scope.addFormToFolder = function (folder,form) {
        FolderService.addFormToFolder(folder,form, folderUpdateCalback);
    };

});

