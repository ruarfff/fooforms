/* global angular */

angular.module('form').factory('FormService',
    ['$log', 'Restangular', 'Forms',
        function ($log, Restangular, Forms) {
            'use strict';
            var formApi = Restangular.all('forms');
            return {
                createForm: function (form, next) {
                    formApi.post(form).then(function (res) {
                        Forms.addOne(res);
                        next(null, res._id);
                    }, function (err) {
                        $log.error(err.toString());
                        next(err);
                    });
                },
                updateForm: function (form, next) {
                    form.put().then(function (res) {
                        Forms.updateOne(form);
                        next();
                    }, function (err) {
                        $log.error(err.toString());
                        next(err);
                    });
                },
                deleteForm: function (form, next) {
                    form.remove().then(function (res) {
                        Forms.removeOne(form);
                        next();
                    }, function (err) {
                        $log.error(err.toString());
                        next(err);
                    });
                },
                getUserForms: function (next) {
                    formApi.getList().then(function (forms) {
                        Forms.updateAll(forms);
                        next();
                    }, function (err) {
                        $log.error(err.toString());
                        next(err);
                    });
                }
            };
        }]);

angular.module('form').service('Forms',
    ['_',
        function (_) {
            'use strict';
            this.form = {};
            this.forms = [];
            this.postObj = {};
            this.updateAll = function (forms) {
                this.forms = forms;
            };
            this.addOne = function (form) {
                this.forms.push(form);
            };
            this.updateOne = function (form) {
                var index;
                var count = this.forms.length;

                for (index = 0; index < count; index++) {
                    if (this.forms[index]._id === form._id) {
                        this.forms[index] = form;
                    }
                }
                this.updateAll(this.forms);
            };
            this.removeOne = function (form) {
                var index;
                var count = this.forms.length;

                for (index = 0; index < count; index++) {
                    if (this.forms[index]._id === form._id) {
                        this.forms.splice(index, 1);
                    }
                }
                this.updateAll(this.forms);
            };
            this.findById = function (id) {
                var index;
                var count = this.forms.length;

                for (index = 0; index < count; index++) {
                    if (this.forms[index]._id === id) {
                        return this.forms[index];
                    }
                }
                return null;
            };
            this.resetCurrentForm = function () {
                this.form = {};
            };

            this.setCurrentForm = function (newForm) {
                this.form = newForm;
            };
            this.getCurrentForm = function () {
                if (_.isEmpty(this.form)) {
                    this.form = {
                        "name": "Untitled Form",
                        "icon": "/assets/icons/color/document.png",
                        "description": "My new form!",
                        "menuLabel": "Untitled Form",
                        "btnLabel": "New Post",
                        "settings": {
                            "allowComments": true,
                            "status": "draft",
"tandcWeb" : false,
                    "tandcDashboard": false,
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
                        "sharing": {"type": "Private", "folder": ""},
                        "privileges": "user",
                        "formEvents": []
                    };
                }
                return this.form;
            };

            return this;
        }]);

