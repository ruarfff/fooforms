/* global angular */

angular.module('form').factory('FormService',
    ['$log', 'Restangular',
        function ($log, Restangular) {
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
                    form.put().then(function (res) {
                        next(null, res);
                    }, function (err) {
                        $log.error(err);
                        next(err);
                    });
                },
                deleteForm: function (form, next) {
                    form.remove().then(function (res) {
                        next(null, res);
                    }, function (err) {
                        $log.error(err);
                        next(err);
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
                    return {
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
                        "private": true,
                        "sharing": {"type": "ALL"},
                        "formEvents": []

                    };
                }
            };
        }]);
