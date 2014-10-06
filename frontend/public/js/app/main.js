/*jslint node: true */
/* global angular */

var fooformsApp = angular.module('fooformsApp', [
    // Vendor dependencies
    'ngRoute', 'ngSanitize', 'trNgGrid', 'restangular', 'ui.bootstrap', 'textAngular', 'ui.calendar', 'angularFileUpload', 'ui.sortable',
    // Custom dependencies
    'dashboard', 'form', 'formBuilder', 'formViewer', 'user', 'organisation', 'team' , 'authentication'
]);

fooformsApp
    .factory("SessionService", ['$q', '$log', 'AuthService', 'DashboardService', 'Session', function ($q, $log, AuthService, DashboardService, Session) {
        return {
            checkSession: function () {
                var deferred = $q.defer();
                if (!AuthService.isAuthenticated()) {
                    AuthService.checkStoredCredentials(function (err, user) {
                        if (err) {
                            $log.log(err);
                        }
                        if (!AuthService.isAuthenticated()) {
                            window.location.href = '/login';
                        } else {
                            DashboardService.getUserDashboard(function (err, result) {
                                if (err) {
                                    $log.error(err);
                                } else {
                                    $log.info(result);
                                    Session.user = result;
                                    deferred.resolve(Session.user);
                                }
                            });
                        }
                    });
                } else {
                    deferred.resolve(Session.user);
                }
                return deferred.promise;
            }
        }
    }]);


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
                redirectTo: '/dashboard',
                resolve: {
                    message: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/login', {
                resolve: function () {
                    window.location.href = '/login';
                }
            })
            .when('/dashboard', {
                templateUrl: '/dashboard/partials/standardView',
                controller: 'DashboardCtrl',
                resolve: {
                    message: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/people', {
                templateUrl: '/users/partials/people',
                controller: 'PeopleCtrl',
                resolve: {
                    message: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/profile', {
                templateUrl: '/users/partials/profile',
                controller: 'ProfileCtrl',
                resolve: {
                    message: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/organisations', {
                templateUrl: '/organisations/partials/organisations',
                controller: 'OrganisationCtrl',
                resolve: {
                    message: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/organisations/:organisation', {
                templateUrl: '/organisations/partials/organisation-profile',
                controller: 'OrganisationCtrl',
                resolve: {
                    message: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/teams', {
                templateUrl: '/teams/partials/teams',
                controller: 'TeamCtrl',
                resolve: {
                    message: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/teams/:team', {
                templateUrl: '/teams/partials/team-profile',
                controller: 'TeamCtrl',
                resolve: {
                    message: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/formBuilder', {
                templateUrl: '/forms/partials/formBuilder',
                controller: 'FormBuilderCtrl',
                resolve: {
                    message: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/forms', {
                templateUrl: '/forms/partials/forms',
                controller: 'FormCtrl',
                resolve: {
                    message: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/:formOwner/:form', {
                templateUrl: '/partials/formViewer',
                controller: 'FormViewerCtrl',
                resolve: {
                    message: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })

        /**
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
         .when('/:username/:form', {
                templateUrl: '/partials/folder',
                controller: 'FolderCtrl'
            })
         **/
            .when('/calendar', {
                templateUrl: '/calendar/partials/calendar',
                resolve: {
                    message: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/userGuide', {
                templateUrl: '/dashboard/partials/userGuide',
                resolve: {
                    message: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/settings', {
                templateUrl: '/dashboard/partials/settings',
                resolve: {
                    message: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/admin', {
                templateUrl: '/admin/partials/admin',
                resolve: {
                    message: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
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

        $scope.setMessage = function (msgBox, status, title, message) {
            $scope.activeMsgBox = msgBox;
            $scope.msgStatus = status;
            $scope.msgTitle = title;
            $scope.msg = message;
        };

    }]);



