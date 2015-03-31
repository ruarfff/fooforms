angular.module('fooformsApp')
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

        $locationProvider.html5Mode(true).hashPrefix('!');

        $urlRouterProvider
            .when('/', '/dashboard')
            .otherwise('/');


        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: '/dashboard/partials/main-view',
                controller: 'DashboardCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }

            })
            .state('login', {
                url: '/login',
                templateUrl: '/login/partials/login',
                controller: 'AuthCtrl'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: '/signup/partials/signup',
                controller: 'AuthCtrl'
            })
            .state('forgottenPassword', {
                url: '/forgotten-password',
                templateUrl: '/forgotten-password/partials/forgotten-password',
                controller: 'ForgottenPasswordCtrl'
            })
            .state('resetPassword', {
                url: '/reset-password/:token',
                templateUrl: '/reset-password/partials/reset-password',
                controller: 'ResetPasswordCtrl'
            })
            .state('invite', {
                url: '/invite/:invite',
                templateUrl: '/invite/partials/invite',
                controller: 'InviteCtrl'
            })
            .state('people', {
                url: '/people',
                templateUrl: '/users/partials/people',
                controller: 'PeopleCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .state('profile', {
                url: '/profile',
                templateUrl: '/users/partials/profile',
                controller: 'ProfileCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .state('userGuide', {
                url: '/userGuide',
                templateUrl: '/dashboard/partials/userGuide',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .state('settings', {
                url: '/settings',
                templateUrl: '/dashboard/partials/settings',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .state('admin', {
                url: '/admin',
                templateUrl: '/admin/partials/admin',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .state('calendar', {
                url: '/calendar',
                templateUrl: '/calendar/partials/calendar',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .state('organisations', {
                url: '/organisations',
                templateUrl: '/organisations/partials/organisations',
                controller: 'OrganisationCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .state('organisations.profile', {
                url: '/organisations/:organisation',
                templateUrl: '/organisations/partials/organisation-profile',
                controller: 'OrganisationCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .state('teams', {
                url: '/teams',
                templateUrl: '/teams/partials/teams',
                controller: 'TeamCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .state('teams.profile', {
                url: '/teams/:team',
                templateUrl: '/teams/partials/team-profile',
                controller: 'TeamProfileCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .state('formBuilder', {
                url: '/formBuilder',
                templateUrl: '/forms/partials/formBuilder',
                controller: 'FormBuilderCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .state('forms', {
                url: '/forms',
                templateUrl: '/forms/partials/forms',
                controller: 'FormCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .state('user.profile', {
                url: '/user/:name',
                templateUrl: '/users/partials/user-profile',
                controller: 'UserViewCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .state('main', {
                url: '/:name',
                templateUrl: '/dashboard/partials/main-view',
                controller: 'DashboardCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .state('main.team', {
                url: '/:name/teams/:team',
                templateUrl: '/dashboard/partials/main-view',
                controller: 'DashboardCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .state('main.newForm', {
                url: '/:name/new-form',
                templateUrl: '/forms/partials/formBuilder',
                controller: 'FormBuilderCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .state('main.editForm', {
                url: '/:name/:form/edit',
                templateUrl: '/forms/partials/formBuilder',
                controller: 'FormBuilderCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .state('main.form', {
                url: '/:name/:form',
                templateUrl: '/dashboard/partials/main-view',
                controller: 'FormViewerCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .state('main.team.editForm', {
                url: '/:name/teams/:team/:form/edit',
                templateUrl: '/forms/partials/formBuilder',
                controller: 'FormBuilderCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            })
            .state('main.team.form', {
                url: '/:name/teams/:team/:form',
                templateUrl: '/dashboard/partials/main-view',
                controller: 'FormViewerCtrl',
                resolve: {
                    session: function (SessionService) {
                        return SessionService.checkSession();
                    }
                }
            });
    }]);