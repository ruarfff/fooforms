/*jslint node: true */
/* global angular */

var fooformsApp = angular.module('fooformsApp', [
    // Vendor dependencies
    'ngRoute', 'ngGrid', 'restangular', 'ui.bootstrap', 'textAngular', 'ui.calendar','angularFileUpload',
    // Custom dependencies
    'dashboard', 'folder', 'formBuilder', 'formViewer', 'user', 'authentication'
]);

// configure our routes
fooformsApp
    .config(function ($routeProvider, $locationProvider, RestangularProvider) {
        'use strict';
        $locationProvider.html5Mode(true).hashPrefix('!');

        RestangularProvider.setErrorInterceptor(
            function (res) {
                if (res.status === 401) {
                    window.location.href = '/login';
                }
                return false; // stop the promise chain
            });
        RestangularProvider.setBaseUrl('/api');
        RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});

        $routeProvider
            .when('/', {
                redirectTo: '/dashboard'
            })
            .when('/dashboard', {
                templateUrl: '/partials/dashboard',
                controller: 'DashboardCtrl'
            })
            .when('/folders', {
                templateUrl: '/partials/folders',
                controller: 'FolderCtrl'
            })
            .when('/forms', {
                templateUrl: '/partials/forms',
                controller: 'FormsCtrl'
            })
            .when('/people', {
                templateUrl: '/partials/people',
                controller: 'PeopleCtrl'
            })
            .when('/calendar', {
                templateUrl: '/partials/calendar'
            })
            .when('/profile', {
                templateUrl: '/partials/profile',
                controller: 'ProfileCtrl'
            })
            .when('/userGuide', {
                templateUrl: '/partials/userGuide'
            })
            .when('/settings', {
                templateUrl: '/partials/settings'
            })
            .when('/admin', {
                templateUrl: '/partials/admin'
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
            .when('/:username/folders', {
                templateUrl: '/partials/folders',
                controller: 'FoldersCtrl'
            })
            .when('/:username/:folder/:form', {
                templateUrl: '/partials/formViewer',
                controller: 'FormViewerCtrl'
            })
            .otherwise({redirectTo:'/'});
    })
    .config(['$httpProvider', function ($httpProvider) {
        'use strict';
        //Http Interceptor to check auth failures for xhr requests
        $httpProvider.interceptors.push('authHttpResponseInterceptor');
    }])
    .factory('authHttpResponseInterceptor', ['$q', '$location', function ($q) {
        'use strict';
        return {
            response: function (response) {
                if (response.status === 401) {
                    console.log("Response 401");
                }
                return response || $q.when(response);
            },
            responseError: function (rejection) {
                if (rejection.status === 401) {
                    console.log("Response Error 401", rejection);
                    window.location.href = '/login';
                }
                return $q.reject(rejection);
            }
        };
    }])
    .controller('MainController', function ($scope, $location, USER_ROLES, AuthService, $upload) {
        'use strict';
        AuthService.checkStoredCredentials(function (err) {
            if(err) {
                window.location = '/login';
            }
        });
        $scope.user = null;
        $scope.userRoles = USER_ROLES;
        $scope.isAuthorized = AuthService.isAuthorized;

        //Messaging throughout App
        $scope.activeMsgBox = ''; // any string --matches ng-show of various msgboxes.
        $scope.msgStatus = ''; // used in class, so alert-danger, etc...
        $scope.msgTitle = ''; // optional -
        $scope.msg = ''; // optional, but pretty fucking stupid not to populate it

        $scope.setMessage = function (msgBox, status, title, message) {

            $scope.activeMsgBox = msgBox;
            $scope.msgStatus = status;
            $scope.msgTitle = title;
            $scope.msg = message;
        };

        $scope.init = function () {
            AuthService.checkUser(function (user) {
                if (AuthService.isAuthenticated()) {
                    $scope.user = user;
                    if (!$scope.user.photo) {
                        $scope.user.photo = '/assets/images/photo.jpg';
                    }
                } else {
                    window.location.href = '/login';
                }
            });
        };

        $scope.onFileSelect = function($files,formObj) {
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: '/api/file/', //upload.php script, node.js route, or servlet url
                    // method: POST or PUT,
                    // headers: {'header-key': 'header-value'},
                    // withCredentials: true,
                    data: {formObj: formObj, file:file},
                    file: file // or list of files: $files for html5 only
                    /* set the file formData name ('Content-Desposition'). Default is 'file' */
                    //fileFormDataName: myFile, //or a list of names for multiple files (html5).
                    /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
                    //formDataAppender: function(formData, key, val){}
                }).progress(function(evt) {
                        formObj.progress = parseInt(100.0 * evt.loaded / evt.total);
                    }).success(function(data, status, headers, config) {
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
    });
