angular.module('fooformsApp')
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider
            .when('/', '/dashboard')
            .otherwise('/');


        $stateProvider.state('home', {
            url: '/'

        });


        $routeProvider
            .when('/', {
                redirectTo: '/dashboard',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
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
                controller: 'DashboardCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/invite/:invite', {
                templateUrl: '/invite/partials/invite',
                controller: 'InviteCtrl'
            })
            .when('/people', {
                templateUrl: '/users/partials/people',
                controller: 'PeopleCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/profile', {
                templateUrl: '/users/partials/profile',
                controller: 'ProfileCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/userGuide', {
                templateUrl: '/dashboard/partials/userGuide',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/settings', {
                templateUrl: '/dashboard/partials/settings',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/admin', {
                templateUrl: '/admin/partials/admin',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/calendar', {
                templateUrl: '/calendar/partials/calendar',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/organisations', {
                templateUrl: '/organisations/partials/organisations',
                controller: 'OrganisationCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/organisations/:organisation', {
                templateUrl: '/organisations/partials/organisation-profile',
                controller: 'OrganisationCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/teams', {
                templateUrl: '/teams/partials/teams',
                controller: 'TeamCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/teams/:team', {
                templateUrl: '/teams/partials/team-profile',
                controller: 'TeamProfileCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/formBuilder', {
                templateUrl: '/forms/partials/formBuilder',
                controller: 'FormBuilderCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/forms', {
                templateUrl: '/forms/partials/forms',
                controller: 'FormCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/user/:name', {
                templateUrl: '/users/partials/user-profile',
                controller: 'UserViewCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/:name', {
                templateUrl: '/dashboard/partials/main-view',
                controller: 'DashboardCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/:name/teams/:team', {
                templateUrl: '/dashboard/partials/main-view',
                controller: 'DashboardCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/:name/new-form', {
                templateUrl: '/forms/partials/formBuilder',
                controller: 'FormBuilderCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/:name/:form/edit', {
                templateUrl: '/forms/partials/formBuilder',
                controller: 'FormBuilderCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/:name/:form', {
                templateUrl: '/dashboard/partials/main-view',
                controller: 'FormViewerCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/:name/teams/:team/:form/edit', {
                templateUrl: '/forms/partials/formBuilder',
                controller: 'FormBuilderCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .when('/:name/teams/:team/:form', {
                templateUrl: '/dashboard/partials/main-view',
                controller: 'FormViewerCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .otherwise({redirectTo: '/'});
    }]);