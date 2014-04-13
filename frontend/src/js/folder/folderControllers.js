fooformsApp.controller('FolderCtrl', function ($scope, $route, Restangular, FolderService, Folders) {
    "use strict";

    var folderUpdateCalback = function(err) {
        if(!err) {
            $scope.folders = Folders.folders;
            $scope.privateFolders = Folders.privateFolders;
            $scope.publicFolders = Folders.publicFolders;
        }
    };
    FolderService.getFolders(folderUpdateCalback);

    $scope.tabs = [
        {name: "Folders", active: true},
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

});