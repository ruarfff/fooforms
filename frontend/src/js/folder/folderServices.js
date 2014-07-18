/* global angular */

angular.module('folder').service('Folders',
    ['_' , function (_) {
        'use strict';

        this.updateAll = function (folders) {
            this.folders = folders;

            this.folder = {};


            this.privateFolders = [];
            this.publicFolders = [];

            var index;
            var count = this.folders.length;

            for (index = 0; index < count; index++) {
                if (this.folders[index].isPrivate) {
                    this.privateFolders.push(folders[index]);
                } else {
                    this.publicFolders.push(folders[index]);
                }
            }
        };
        this.addOne = function (folder) {
            if (folder.isPrivate) {
                this.privateFolders.push(folder);
            } else {
                this.publicFolders.push(folder);
            }
        };
        this.updateOne = function (folder) {
            var index;
            var count = this.folders.length;

            for (index = 0; index < count; index++) {
                if (this.folders[index]._id === folder._id) {
                    this.folders[index] = folder;
                }
            }
            this.updateAll(this.folders);
        };
        this.removeOne = function (folder) {
            var index;
            var count = this.folders.length;

            for (index = 0; index < count; index++) {
                if (this.folders[index]._id === folder._id) {
                    this.folders.splice(index, 1);
                }
            }
            this.updateAll(this.folders);
        };


        this.findById = function (id) {
            var index;
            var count = this.folders.length;

            for (index = 0; index < count; index++) {
                if (this.folders[index]._id === id) {
                    return this.folders[index];
                }
            }
            return null;
        };

        this.findByName = function (name) {
            var index;
            var count = this.folders.length;

            for (index = 0; index < count; index++) {
                if (this.folders[index].name === name) {
                    return this.folders[index];
                }
            }
            return null;
        };

        this.resetCurrentFolder = function () {
            this.folder = {};
        };

        this.setCurrentFolder = function (newFolder) {
            this.folder = newFolder;
        };
        this.getCurrentFolder = function () {
            if (_.isEmpty(this.folder)) {
                this.folder = {
                    "name": "New Folder",
                    "icon": "/assets/icons/color/document.png",
                    "description": "My new folder!",
                    "menuLabel": "New Folder"

                };
            }
            return this.folder;
        };
        return this;
    }]);

angular.module('folder').factory('FolderService',
    ['$log', 'Restangular', 'Folders',
        function ($log, Restangular, Folders) {
            'use strict';
            var folderApi = Restangular.all('folders');
            return {
                getFolders: function (next) {
                    folderApi.getList().then(function (folders) {
                        Folders.updateAll(folders);
                        next();
                    }, function (err) {
                        $log.error(err.toString());
                        next(err);
                    });
                },
                getFolderForms: function (folder, next) {
                    folder.getList('forms').then(function (forms) {
                        next(forms);
                    }, function (err) {
                        $log.error(err.toString());
                        next(err);
                    });
                },
                createFolder: function (folder, next) {
                    folderApi.post(folder).then(function (res) {
                        Folders.addOne(res.data);
                        next(null, res.data._id);
                    }, function (err) {
                        $log.error(err.toString());
                        next(err);
                    });
                },
                updateFolder: function (folder, next) {
                    folder.put().then(function (res) {
                        Folders.updateOne(res.data);
                        next();
                    }, function (err) {
                        $log.error(err.toString());
                        next(err);
                    });
                },
                deleteFolder: function (folder, next) {
                    folder.remove().then(function (res) {
                        Folders.removeOne(folder);
                        next();
                    }, function (err) {
                        $log.error(err.toString());
                        next(err);
                    });
                },
                addFormToFolder: function (folder, form, next) {
                    folder.put('/forms/add').then(function (res) {
                        var test = res;
                    }, function (err) {
                        $log.error(err.toString());
                        next(err);
                    });
                },
                removeFormFromFolder: function (folder, form, next) {

                },
                addMemberToFolder: function (folder, user, next) {

                },
                addMemberWithWritePermissionsToFolder: function (folder, user, next) {

                },
                removeMemberFromFolder: function (folder, user, next) {

                },
                removeMemberWritePermissionsFromFolder: function (folder, user, next) {

                }
            };
        }]);

