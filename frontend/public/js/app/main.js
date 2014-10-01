/*jslint node: true */
/* global angular */

var fooformsApp = angular.module('fooformsApp', [
    // Vendor dependencies
    'ngRoute', 'ngSanitize', 'trNgGrid', 'restangular', 'ui.bootstrap', 'textAngular', 'ui.calendar', 'angularFileUpload', 'ui.sortable',
    // Custom dependencies
    'dashboard', 'form', 'formBuilder', 'formViewer', 'user', 'organisation', 'team' ,'authentication'
]);

fooformsApp
    .config(['$routeProvider', '$locationProvider', 'RestangularProvider', function ($routeProvider, $locationProvider, RestangularProvider) {
        'use strict';
        $locationProvider.html5Mode(true).hashPrefix('!');
        RestangularProvider.setBaseUrl('/api');
        RestangularProvider.setErrorInterceptor(
            function (res) {
                if (res.status === 401) {
                    window.location = '/login';
                }
                return false; // stop the promise chain
            });
        RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});

        $routeProvider
            .when('/', {
                redirectTo: '/dashboard'
            })
            .when('/login', {
                resolve: function () {
                    window.location.href = '/login';
                }
            })
            .when('/dashboard', {
                templateUrl: '/dashboard/partials/standardView',
                controller: 'DashboardCtrl'
            })
            .when('/people', {
                templateUrl: '/users/partials/people',
                controller: 'PeopleCtrl'
            })
            .when('/profile', {
                templateUrl: '/users/partials/profile',
                controller: 'ProfileCtrl'
            })
            .when('/calendar', {
                templateUrl: '/calendar/partials/calendar'
            })
            .when('/userGuide', {
                templateUrl: '/dashboard/partials/userGuide'
            })
            .when('/settings', {
                templateUrl: '/dashboard/partials/settings'
            })
            .when('/admin', {
                templateUrl: '/admin/partials/admin'
            })
            .when('/organisations', {
                templateUrl: '/organisations/partials/organisations'
            })
            .when('/teams', {
                templateUrl: '/teams/partials/teams'
            })
        /**
         .when('/forms', {
                templateUrl: '/partials/forms',
                controller: 'FormsCtrl'
            })
         .when('/formBuilder', {
                templateUrl: '/partials/formBuilder',
                controller: 'FieldsCtrl'
            })
         .when('/posts', {
                templateUrl: '/partials/formViewer',
                controller: 'FormViewerCtrl'
            })
         .when('/:username', {
                templateUrl: '/partials/profile',
                controller: 'ProfileCtrl'
            })
         .when('/:username/:folder', {
                templateUrl: '/partials/folder',
                controller: 'FolderCtrl'
            })
         .when('/:username/:folder/:form', {
                templateUrl: '/partials/formViewer',
                controller: 'FormViewerCtrl'
            })**/
            .otherwise({redirectTo: '/'});
    }])
    .config(['$httpProvider', function ($httpProvider) {
        'use strict';
        //Http Interceptor to check auth failures for xhr requests
        $httpProvider.interceptors.push('authHttpResponseInterceptor');
    }])
    .factory('authHttpResponseInterceptor', ['$q', '$location', '$log', function ($q, $location, $log) {
        'use strict';
        return {
            response: function (response) {
                if (response.status === 401) {
                    $log.log("Response 401");
                }
                return response || $q.when(response);
            },
            responseError: function (rejection) {
                if (rejection.status === 401) {
                    $log.log("Response Error 401", rejection);
                }
                return $q.reject(rejection);
            }
        };
    }])
    .controller('HeadController', ['$scope', function ($scope) {
        $scope.stylesheet = 'bootstrap';

        $scope.swapStyle = function (style) {
            $scope.stylesheet = style;
        }
    }])
    .controller('MainController', ['$scope', '$location', '$log' , '$upload', 'USER_ROLES', 'AuthService', 'Session', 'DashboardService', function ($scope, $location, $log, $upload, USER_ROLES, AuthService, Session, DashboardService) {
        'use strict';
        $scope.sideMenuVisible = true;

        //Messaging throughout App
        $scope.activeMsgBox = ''; // any string --matches ng-show of various msgboxes.
        $scope.msgStatus = ''; // used in class, so alert-danger, etc...
        $scope.msgTitle = ''; // optional -
        $scope.msg = ''; // optional, but pretty stupid not to populate it

        // Allow the user to be update throughout the app using the Session service.
        $scope.$watch(function () {
            return Session.user
        }, function (newVal, oldVal) {
            if (typeof newVal !== 'undefined') {
                $scope.user = Session.user;
                if (!$scope.user.photo) {
                    $scope.user.photo = '/assets/images/photo.jpg';
                }
            }
        });

        $scope.init = function () {
            AuthService.checkStoredCredentials(function (err, user) {
                if (err) {
                    $log.log(err);
                }
                if (!AuthService.isAuthenticated()) {
                    window.location.href = '/login';
                } else {
                    $scope.userRoles = USER_ROLES;
                    $scope.isAuthorized = AuthService.isAuthorized;
                    DashboardService.getUserDashboard(function (err, result) {
                        if (err) {
                            $log.error(err);
                        } else {
                            $log.log(result);
                            Session.user = result;
                        }
                    });
                }
            });
        };

        $scope.setMessage = function (msgBox, status, title, message) {
            $scope.activeMsgBox = msgBox;
            $scope.msgStatus = status;
            $scope.msgTitle = title;
            $scope.msg = message;
        };

        $scope.onFileSelect = function ($files, formObj) {
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: '/api/file/', //upload.php script, node.js route, or servlet url
                    // method: POST or PUT,
                    // headers: {'header-key': 'header-value'},
                    // withCredentials: true,
                    data: {formObj: formObj, file: file},
                    file: file // or list of files: $files for html5 only
                    /* set the file formData name ('Content-Desposition'). Default is 'file' */
                    //fileFormDataName: myFile, //or a list of names for multiple files (html5).
                    /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
                    //formDataAppender: function(formData, key, val){}
                }).progress(function (evt) {
                    formObj.progress = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function (data, status, headers, config) {
                    // file is uploaded successfully
                    alert(data);
                });
                //.error(...)
                //.then(success, error, progress);
                //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
            }
            /* alternative way of uploading, send the file binary with the file's content-type.
             Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed.
             It could also be used to monitor the progress of a normal http post/put request with large data*/
            // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
        };
    }]);
