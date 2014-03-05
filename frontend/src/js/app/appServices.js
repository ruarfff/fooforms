fooformsApp.service('appService', function () {
    'use strict';
    this.app = {};

    this.resetApp = function () {
        this.app = {};
    };

    this.setApp = function (newApp) {
        this.app = newApp;
    };
    this.getApp = function () {
        if (_.isEmpty(this.app)) {
            this.app = {
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
        }
        return this.app;
    };
});
