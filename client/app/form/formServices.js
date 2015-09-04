angular.module('fooforms.form')
    .factory('formService',
    ['$log', 'Restangular', 'session',
        function ($log, Restangular, session) {
            'use strict';
            var formApi = Restangular.all('forms');
            return {
                createForm: function (form, next) {
                    formApi.post(form).then(function (res) {
                        next(null, res);
                    }, function (err) {
                        $log.error(err);
                        next(err);
                    });
                },
                updateForm: function (form, next) {
                    if (typeof form.put !== 'function') {
                        form = Restangular.restangularizeElement(formApi, form, '');
                    }
                    form.put().then(function (res) {
                        next(null, res);
                    }, function (err) {
                        $log.error(err);
                        next(err);
                    });
                },
                deleteForm: function (form, next) {
                    if (typeof form.remove !== 'function') {
                        form = Restangular.restangularizeElement(formApi, form, '');
                    }
                    form.remove().then(function () {
                        return next(null);
                    }, function (err) {
                        $log.error(err);
                        return next(err);
                    });
                },
                getUserForms: function (next) {
                    formApi.getList().then(function (forms) {
                        next(null, forms);
                    }, function (err) {
                        $log.error(err);
                        next(err);
                    });
                },
                moveToFolder: function (args, next) {
                    if (typeof args.form.patch !== 'function') {
                        args.form = Restangular.restangularizeElement(formApi, args.form, '');
                    }
                    args.form.patch({
                        action: 'moveToFolder',
                        folder: args.folderId
                    }).then(function (form) {
                        return next(null, form);
                    }, function (err) {
                        return next(err);
                    });
                },
                getFormTemplateObject: function () {
                    var defaultFolder = session.user.defaultFolder;
                    var template = {
                        "displayName": "",
                        "title": "",
                        "icon": "/assets/icons/color/document.png",
                        "description": "My new form!",
                        "btnLabel": "New Post",
                        "settings": {
                            "allowComments": true,
                            "status": "draft",
                            "tandcWeb": false,
                            "tandcHtml": '',
                            "displayOptions": {
                                "color": "#94b5c3",
                                "feed": true,
                                "list": true,
                                "grid": true,
                                "customDashboard": false,
                                "customForm": false,
                                "customSubmitMsg": false

                            },
                            "customDashboardHtml": '<div>Replace This with your Custom Dashboard View</div>',
                            "customFormHtml": '<div>Replace This with your Custom Form View</div>',
                            "customSubmitHtml": '<div>Replace This with your Custom Form View</div>'
                        },
                        "fields": [],
                        "owner": "",
                        "folder": defaultFolder,
                        "sharing": {"type": "ALL"},
                        "formEvents": []
                    };
                    return angular.copy(template);
                }
            };
        }]);
