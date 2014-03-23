fooformsApp.service('appService', function () {
    'use strict';
    this.app = {};
    this.postObj = {};

    this.resetApp = function () {
        this.app = {};
    };

    this.setApp = function (newApp) {
        this.app = newApp;
    };

    this.newPost = function () {
        this.postObj = angular.copy(this.app);
        this.postObj._id = null;
        return this.postObj;
    };

    this.setPost = function (newPost) {
        this.postObj = newPost;
        return
    };

    this.getApp = function () {
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
});
