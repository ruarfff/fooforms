/* global angular */

angular.module('form').factory('FormService',
    ['$log', 'Restangular', 'Session',
        function ($log, Restangular, Session) {
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
                    form = Restangular.restangularizeElement(formApi, form, '');
                    form.put().then(function (res) {
                        next(null, res);
                    }, function (err) {
                        $log.error(err);
                        next(err);
                    });
                },
                deleteForm: function (form, next) {
                    form = Restangular.restangularizeElement(formApi, form, '');
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
                getFormTemplateObject: function () {
                    var defaultFolder = Session.user.defaultFolder;
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
                                "feed": true,
                                "list": true,
                                "grid": true,
                                "customDashboard": false,
                                "customForm": false

                            },
                            "customDashboardHtml": '<div>Custom Dashboard View</div>',
                            "customFormHtml": '<div>Custom Form View</div>'
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
