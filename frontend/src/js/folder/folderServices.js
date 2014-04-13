angular.module('folder').factory('FolderService', function (Restangular, Folders) {
    var folderApi = Restangular.all('folders');
    return {
        getFolders: function (next) {
            folderApi.getList().then(function (folders) {
                Folders.updateAll(folders);
                next();
            }, function (err) {
                // TODO: Handle error
                console.log(err.toString());
                next(err);
            });
        },
        createFolder: function (folder, next) {
            folderApi.post(folder).then(function (res) {
                Folders.addOne(res.data);
                next(null, res.data._id);
            }, function (err) {
                // TODO: Handle error
                console.log(err.toString());
                next(err);
            });
        },
        updateFolder: function (folder, next) {
            folder.put().then(function (res) {
                Folders.updateOne(res.data);
                next();
            }, function (err) {
                // TODO: Handle error
                console.log(err.toString());
                next(err);
            });
        },
        deleteFolder: function (folder, next) {
            folder.remove().then(function (res) {
                Folders.removeOne(folder);
                next();
            }, function (err) {
                console.log(err.toString());
                next(err);
            });
        }
    };
});

angular.module('folder').service('Folders', function () {
    this.updateAll = function (folders) {
        this.folders = folders;

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
            if(this.folders[index]._id == folder._id) {
                this.folders[index] = folder;
            }
        }
        this.updateAll(this.folders);
    };
    this.removeOne = function (folder) {
        var index;
        var count = this.folders.length;

        for (index = 0; index < count; index++) {
            if(this.folders[index]._id == folder._id) {
                this.folders.splice(index, 1);
            }
        }
        this.updateAll(this.folders);
    };
    return this;
});