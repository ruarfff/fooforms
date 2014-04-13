var fooformsApp = angular.module('fooformsApp', [
    // Vendor dependencies
    'ngRoute', 'ngGrid', 'restangular', 'ui.bootstrap', 'textAngular', 'ui.calendar',
    // Custom dependencies
    'dashboard', 'folder', 'form', 'formBuilder', 'formViewer', 'user'
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
                templateUrl: '/partials/people'
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
            .otherwise({
                templateUrl: '/partials/formViewer',
                controller: 'FormViewerCtrl'
            });
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
    .controller('MainController', function ($scope, $location, USER_ROLES, AuthService) {
        'use strict';
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
    });
