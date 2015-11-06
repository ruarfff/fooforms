(function () {
    'use strict';

    angular.module('fooforms.core')
        .config(routerConfig);

    routerConfig.$inject = ['$routeProvider', '$locationProvider'];

    /* @ngInject */
    function routerConfig($routeProvider, $locationProvider) {
        'use strict';

        $locationProvider.html5Mode(true).hashPrefix('!');

        $routeProvider
            .when('/', {
                redirectTo: '/dashboard',
                resolve: {
                    currentSession: function (sessionService) {
                        return sessionService.checkSession();
                    }
                }
            })
            .when('/login', {
                templateUrl: '/login/partials/login',
                controller: 'AuthCtrl'
            })
            .when('/signup', {
                templateUrl: '/signup/partials/signup',
                controller: 'AuthCtrl'
            })
            .when('/forgotten-password', {
                templateUrl: '/forgotten-password/partials/forgotten-password',
                controller: 'ForgottenPasswordCtrl'
            })
            .when('/reset-password/:token', {
                templateUrl: '/reset-password/partials/reset-password',
                controller: 'ResetPasswordCtrl'
            })
            .when('/dashboard', {
                templateUrl: '/dashboard/partials/main-view',
                controller: 'DashboardController',
                resolve: {
                    currentSession: function (sessionService) {
                        return sessionService.checkSession();
                    }
                }
            })
            .when('/invite/:invite', {
                templateUrl: '/invite/partials/invite',
                controller: 'InviteCtrl'
            })
            .when('/people', {
                templateUrl: '/users/partials/people',
                controller: 'PeopleController',
                resolve: {
                    currentSession: function (sessionService) {
                        return sessionService.checkSession();
                    }
                }
            })
            .when('/profile', {
                templateUrl: '/users/partials/profile',
                controller: 'ProfileController',
                resolve: {
                    currentSession: function (sessionService) {
                        return sessionService.checkSession();
                    }
                }
            })
            .when('/userGuide', {
                templateUrl: '/dashboard/partials/userGuide',
                resolve: {
                    currentSession: function (sessionService) {
                        return sessionService.checkSession();
                    }
                }
            })
            .when('/settings', {
                templateUrl: '/dashboard/partials/settings',
                resolve: {
                    currentSession: function (sessionService) {
                        return sessionService.checkSession();
                    }
                }
            })
            .when('/admin', {
                templateUrl: '/admin/partials/admin',
                resolve: {
                    currentSession: function (sessionService) {
                        return sessionService.checkSession();
                    }
                }
            })
            .when('/calendar', {
                templateUrl: '/calendar/partials/calendar',
                resolve: {
                    currentSession: function (sessionService) {
                        return sessionService.checkSession();
                    }
                }
            })
            .when('/organisations', {
                templateUrl: '/organisations/partials/organisations',
                controller: 'OrganisationCtrl',
                resolve: {
                    currentSession: function (sessionService) {
                        return sessionService.checkSession();
                    }
                }
            })
            .when('/organisations/:organisation', {
                templateUrl: '/organisations/partials/organisation-profile',
                controller: 'OrganisationCtrl',
                resolve: {
                    currentSession: function (sessionService) {
                        return sessionService.checkSession();
                    }
                }
            })
            .when('/teams', {
                templateUrl: '/teams/partials/teams',
                controller: 'TeamCtrl',
                resolve: {
                    currentSession: function (sessionService) {
                        return sessionService.checkSession();
                    }
                }
            })
            .when('/teams/:team', {
                templateUrl: '/teams/partials/team-profile',
                controller: 'TeamProfileCtrl',
                resolve: {
                    currentSession: function (sessionService) {
                        return sessionService.checkSession();
                    }
                }
            })
            .when('/formBuilder', {
                templateUrl: '/forms/partials/formBuilder',
                controller: 'FormBuilderCtrl',
                resolve: {
                    currentSession: function (sessionService) {
                        return sessionService.checkSession();
                    }
                }
            })
            .when('/forms', {
                templateUrl: '/forms/partials/forms',
                controller: 'FormCtrl',
                resolve: {
                    currentSession: function (sessionService) {
                        return sessionService.checkSession();
                    }
                }
            })
            .when('/user/:name', {
                templateUrl: '/users/partials/user-profile',
                controller: 'UserViewController',
                resolve: {
                    currentSession: function (sessionService) {
                        return sessionService.checkSession();
                    }
                }
            })
            .when('/:name', {
                templateUrl: '/dashboard/partials/main-view',
                controller: 'DashboardController',
                resolve: {
                    currentSession: function (sessionService) {
                        return sessionService.checkSession();
                    }
                }
            })
            .when('/:name/teams/:team', {
                templateUrl: '/dashboard/partials/main-view',
                controller: 'DashboardController',
                resolve: {
                    currentSession: function (sessionService) {
                        return sessionService.checkSession();
                    }
                }
            })
            .when('/:name/new-form', {
                templateUrl: '/forms/partials/formBuilder',
                controller: 'FormBuilderCtrl',
                resolve: {
                    currentSession: function (sessionService) {
                        return sessionService.checkSession();
                    }
                }
            })
            .when('/:name/:form/edit', {
                templateUrl: '/forms/partials/formBuilder',
                controller: 'FormBuilderCtrl',
                resolve: {
                    currentSession: function (sessionService) {
                        return sessionService.checkSession();
                    }
                }
            })
            .when('/:name/:form', {
                templateUrl: '/dashboard/partials/main-view',
                controller: 'FormViewerCtrl',
                resolve: {
                    currentSession: function (sessionService) {
                        return sessionService.checkSession();
                    }
                }
            })
            .when('/:name/teams/:team/:form/edit', {
                templateUrl: '/forms/partials/formBuilder',
                controller: 'FormBuilderCtrl',
                resolve: {
                    currentSession: function (sessionService) {
                        return sessionService.checkSession();
                    }
                }
            })
            .when('/:name/teams/:team/:form', {
                templateUrl: '/dashboard/partials/main-view',
                controller: 'FormViewerCtrl',
                resolve: {
                    currentSession: function (sessionService) {
                        return sessionService.checkSession();
                    }
                }
            })
            .otherwise({redirectTo: '/'});
    }

})();
