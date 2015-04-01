var fooformsApp = angular.module('fooformsApp', [
    // Vendor dependencies
    'ngRoute', 'ngSanitize', 'trNgGrid', 'restangular', 'ui.bootstrap', 'textAngular', 'ui.calendar', 'angularFileUpload', 'ui.sortable', 'infinite-scroll', 'oitozero.ngSweetAlert', 'cgBusy', 'ui.codemirror',
    // Custom dependencies
    'dashboard', 'form', 'formBuilder', 'formViewer', 'user', 'organisation', 'team', 'authentication', 'post', 'comment', 'invite', 'store'
]);

fooformsApp
    .factory("SessionService", ['$location', '$q', '$log', 'Restangular', '_', 'AuthService', 'DashboardService', 'OrganisationService', 'Session',
        function ($location, $q, $log, Restangular, _, AuthService, DashboardService, OrganisationService, Session) {
            return {
                checkSession: function () {
                    var deferred = $q.defer();
                    if (!AuthService.isAuthenticated()) {
                        AuthService.checkStoredCredentials(function (err) {
                            if (err) {
                                $log.log(err);
                            }
                            if (!AuthService.isAuthenticated()) {
                                if ($location.path() !== '/signup') {
                                    $location.path("/login");
                                }
                            } else {
                                DashboardService.getUserDashboard(function (err, result) {
                                    if (err) {
                                        $log.error(err);
                                    } else {
                                        if (!result.photo) {
                                            result.photo = '/assets/images/photo.jpg';
                                        }
                                        result.self = {};
                                        result.self.link = '/api/users/' + result._id;
                                        Session.user = result;

                                        _.forEach(Session.user.organisations, function (organisation) {
                                            organisation.teams = _.filter(Session.user.teams, {organisation: organisation._id});
                                        });


                                        Session.org = angular.copy(Session.user.organisations[0]);
                                        OrganisationService.getMembers(Session.user.organisations[0], function (err, members) {
                                            Session.org.members = members;
                                            for (var i = 0; i < Session.org.members.length; i++) {
                                                // This is to allow Restangular do put & remove on these objects.
                                                Session.org.members[i].self = {};
                                                Session.org.members [i].self.link = '/api/users/' + Session.org.members[i]._id;
                                            }
                                        });


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
        }])
    .factory('authHttpResponseInterceptor', ['$q', '$location', '$log', function ($q, $location, $log) {
        'use strict';
        return {
            response: function (response) {
                if (response.status === 401) {
                    $log.log("Response 401");
                    if ($location.path() !== '/signup') {
                        $location.path("/login");
                    }
                }
                return response || $q.when(response);
            },
            responseError: function (rejection) {
                if (rejection.status === 401) {
                    $log.log("Response Error 401", rejection);
                    if ($location.path() !== '/signup') {
                        $location.path("/login");
                    }
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
    .controller('MainController', ['$scope', '$location', '$log', '$upload', 'USER_ROLES', 'AuthService', 'Session', 'ContactService',
        function ($scope, $location, $log, $upload, USER_ROLES, AuthService, Session, ContactService) {
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
                }
            });
            $scope.$watch(function () {
                return Session.org
            }, function (newVal, oldVal) {
                if (typeof newVal !== 'undefined') {
                    $scope.org = Session.org;
                }
            });

            $scope.setMessage = function (msgBox, status, title, message) {
                $scope.activeMsgBox = msgBox;
                $scope.msgStatus = status;
                $scope.msgTitle = title;
                $scope.msg = message;
            };

        }]);



