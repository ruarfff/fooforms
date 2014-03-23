fooformsApp.factory('AppService', function (Restangular, Apps) {
    'use strict';
    var appApi = Restangular.all('apps');
    return {
        createApp: function (app, next) {
            appApi.post(app).then(function (res) {
                Apps.addOne(res.data);
                next(null, res.data._id);
            }, function (err) {
                // TODO: Handle error
                console.log(err.toString());
                next(err);
            });
        },
        updateApp: function (app, next) {
            app.put().then(function (res) {
                console.log('update');
                Apps.updateOne(app);
                next();
            }, function (err) {
                console.log(err.toString());
                next(err);
            });
        },
        deleteApp: function (app, next) {
            app.remove().then(function (res) {
                Apps.removeOne(app);
                next();
            }, function (err) {
                console.log(err.toString());
                next(err);
            });
        },
        getUserApps: function (next) {
            appApi.getList().then(function (apps) {
                Apps.updateAll(apps);
                next();
            }, function (err) {
                // TODO: Handle error
                console.log(err.toString());
                next(err);
            });
        },
        getCloudApps: function (cloud, next) {
            appApi.getList(cloud._id).then(function (apps) {
                Apps.updateAll(apps);
                next();
            }, function (err) {
                // TODO: Handle error
                console.log(err.toString());
                next(err);
            });
        }
    };
});

fooformsApp.service('Apps', function () {
    'use strict';
    this.app = {};
    this.apps = [];
    this.postObj = {};
    this.updateAll = function (apps) {
        this.apps = apps;
    };
    this.addOne = function (app) {
        this.apps.push(app);
    };
    this.updateOne = function (app) {
        var index;
        var count = this.apps.length;

        for (index = 0; index < count; index++) {
            if(this.apps[index]._id == app._id) {
                this.apps[index] = post;
            }
        }
        this.updateAll(this.apps);
    };
    this.removeOne = function (app) {
        var index;
        var count = this.apps.length;

        for (index = 0; index < count; index++) {
            if(this.apps[index]._id == app._id) {
                this.apps.splice(index, 1);
            }
        }
        this.updateAll(this.apps);
    };
    this.findById = function (id) {
        var index;
        var count = this.apps.length;

        for (index = 0; index < count; index++) {
            if(this.apps[index]._id == id) {
                return this.apps[index];
            }
        }
        return null;
    };
    this.resetCurrentApp = function () {
        this.app = {};
    };

    this.setCurrentApp = function (newApp) {
        this.app = newApp;
    };
    this.getCurrentApp = function () {
        if (_.isEmpty(this.app)) {
            this.app = {
                "name": "Untitled App",
                "icon": "/assets/icons/color/document.png",
                "description": "My new form!",
                "menuLabel": "Untitled Form",
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
                "owner": "",
                "sharing": {"type": "Private", "cloud": ""},
                "privileges": "user",
                "formEvents": []
            };
        }
        return this.app;
    };
    this.newPost = function () {
        this.postObj = angular.copy(this.app);
        this.postObj._id = null;
        return this.postObj;
    };

    this.setPost = function (newPost) {
        this.postObj = newPost;
        return this.postObj;
    };

    return this;
});

