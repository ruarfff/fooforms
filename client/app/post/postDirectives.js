angular.module('fooforms.post')
    // For rendering a collection of posts
    .directive('fooPostCollection', [
        function () {
            return {
                restrict: 'E',
                scope: {
                    view: '@',
                    streams: '@',
                    activePost: '=activePost',
                    activeForm: '=activeForm',
                    posts: '=posts',
                    status: '=status',
                    team: '=team',
                    gridHeadings: '=gridHeadings',
                    showPostForm: '=showPostForm',
                    deletingPostId: '=deletingPostId'
                },
                transclude: true,
                controller: function ($log, $scope, _, Restangular, postService, session) {
                    var currentPostPage = 0;
                    var postPageSize = 15;
                    var hasMorePosts = true;
                    $scope.fetching = true;
                    $scope.showIntroPage = false;
                    $scope.view = 'list';

                    $scope.noUserForms = session.user.defaultFolder.forms.length === 0;

                    $scope.posts = [];

                    var getPosts = function (page, pageSize, postStreams) {
                        $scope.fetching = true;
                        if (postStreams) {
                            postService.getPostsByStreamList({
                                postStreams: postStreams,
                                page: page,
                                pageSize: pageSize
                            }, function (err, posts) {
                                $scope.fetching = false;

                                if (err) {
                                    $log.error(err);
                                }
                                hasMorePosts = posts.has_more;

                                if (posts) {
                                    $scope.posts = $scope.posts.concat(posts);
                                }


                                if ($scope.posts.length > 0 && !$scope.activePost) {
                                    $scope.activePost = Restangular.copy($scope.posts[0]);
                                }

                                if (!$scope.activeForm && $scope.posts.length > 0) {

                                    $scope.activeForm = _.find(session.forms, function (form) {
                                        return _.indexOf(form.postStreams, $scope.activePost.postStream) > -1;
                                    });

                                }


                            });

                        } else {
                            $scope.fetching = false;
                            $scope.showIntroPage = true;
                            $scope.$parent.postView = 'list';
                            $log.debug('Could not load posts. No post streams provided.');
                        }
                    };


                    $scope.addMorePosts = function () {
                        if (hasMorePosts) {
                            currentPostPage = currentPostPage + 1;
                            getPosts(currentPostPage, postPageSize, $scope.streams);
                        }
                    };


                },
                templateUrl: '/template/post/foo-post-collection.html'
            };
        }
    ])


    // Used to render a selected post
    .directive('fooPost', [
        function () {
            return {
                restrict: 'E',
                scope: {
                    activePost: '=activePost',
                    activeForm: '=activeForm',
                    members: '=members',
                    delete: '&deletePost',
                    copy: '&copyPost',
                    cancel: '&cancelPost',
                    save: '&savePost',
                    printPost: '&printPost',
                    fullScreen: '=fullScreen',
                    showFullScreen: '&showFullScreen',
                    cancelFullScreen: '&cancelFullScreen',
                    doingPostApi: '=doingPostApi'
                },
                controller: function ($scope, $timeout) {
                    $scope.addRepeat = function (groupBoxId, row) {
                        var requireRefresh = false;
                        var groupBox = _.findIndex($scope.activePost.fields, function (field) {
                            return field.id == groupBoxId
                        });

                        var tempRepeaters = angular.copy($scope.activePost.fields[groupBox].repeaters);

                        var repeater = {};
                        repeater.id = new Date().getTime();
                        repeater.fields = angular.copy($scope.activePost.fields[groupBox].fields);

                        // need to swap out the field.id's for new ones.
                        var fieldCount = repeater.fields.length;

                        for (var fieldIndex = 0; fieldIndex < fieldCount; fieldIndex++) {
                            var fieldId = repeater.fields[fieldIndex].id;
                            repeater.fields[fieldIndex].id = repeater.id + '_' + fieldId;

                            // Fields specified in calculation need filedIds updated
                            if (repeater.fields[fieldIndex].type == 'calculation') {

                                requireRefresh = true;

                                if (repeater.fields[fieldIndex].options.field1.item != 'Specified Value') {
                                    repeater.fields[fieldIndex].options.field1.item = repeater.id + '_' + repeater.fields[fieldIndex].options.field1.item;
                                }
                                if (repeater.fields[fieldIndex].options.field2.item != 'Specified Value') {
                                    repeater.fields[fieldIndex].options.field2.item = repeater.id + '_' + repeater.fields[fieldIndex].options.field2.item;
                                }
                            }

                            if (repeater.fields[fieldIndex].type == 'progress') {

                                requireRefresh = true;

                                if (repeater.fields[fieldIndex].options.updateMethod) {
                                    repeater.fields[fieldIndex].options.updateField = repeater.id + '_' + repeater.fields[fieldIndex].options.updateField;
                                }

                            }
                        }


                        if ($scope.activePost.fields[groupBox].repeaters.length === 0) {
                            $scope.activePost.fields[groupBox].repeaters.splice(row + 1, 0, repeater);
                        } else {
                            tempRepeaters.splice(row + 1, 0, repeater);
                            //we've changed the structure of the array so all the watchers are pointing to the wrong place.
                            //We need to dump the repeater array and then recreate with scope applied to recreate the correct watchers.
                            // But only if we have fields requiring watchers, such as calc or progress
                            if (requireRefresh) {
                                $scope.activePost.fields[groupBox].repeaters = [];
                                $timeout(function () {
                                    $scope.activePost.fields[groupBox].repeaters = angular.copy(tempRepeaters);

                                });
                            } else {
                                $scope.activePost.fields[groupBox].repeaters = angular.copy(tempRepeaters);
                            }


                        }


                    };
                    $scope.removeRepeat = function (groupBoxId, row) {

                        var groupBox = _.findIndex($scope.activePost.fields, function (field) {
                            return field.id == groupBoxId
                        });
                        var tempRepeaters = angular.copy($scope.activePost.fields[groupBox].repeaters);

                        tempRepeaters.splice(row, 1);
                        //we've changed the structure of the array so all the watchers are pointing to the wrong place.
                        //We need to dump the repeater array and then recreate with scope applied to recreate the correct watchers.

                        $scope.activePost.fields[groupBox].repeaters = [];
                        $timeout(function () {
                            $scope.activePost.fields[groupBox].repeaters = angular.copy(tempRepeaters);
                        });

                    };


                    // Check if the form has a GroupBox and if it's empty
                    // If empty - then add the first repeater row
                    if ($scope.activePost) {
                        var groupBoxes = _.where($scope.activePost.fields, {type: 'groupBox'});
                        var tables = _.where($scope.activePost.fields, {type: 'table'});
                        groupBoxes = groupBoxes.concat(tables);
                        if (groupBoxes.length > 0) {

                            var count = groupBoxes.length;
                            for (var i = 0; i < count; i++) {

                                var groupBoxIndex = _.findIndex($scope.activePost.fields, function (field) {
                                    return field.id == groupBoxes[i].id
                                });
                                if (groupBoxIndex !== -1) {
                                    if ($scope.activePost.fields[groupBoxIndex].repeaters.length === 0) {
                                        $scope.addRepeat(groupBoxes[i].id, 0);
                                    }
                                }


                            }

                        }
                    }


                },
                templateUrl: '/template/post/foo-post.html'
            };
        }
    ])
    .directive('fooPostList', [
        function () {
            return {
                require: '?^fooPostCollection',
                restrict: 'E',
                scope: {
                    posts: '=posts',
                    activePost: '=activePost',
                    activeForm: '=activeForm',
                    deletingPostId: '=deletingPostId',
                    status: '=status'
                },
                controller: function ($scope, session, $timeout, Restangular) {
                    $scope.selectPost = function (post) {

                        if ($scope.activePost._id !== post._id) {

                            $scope.activePost = false;

                            $timeout(function () {
                                $scope.postView = 'list';


                                $scope.activePost = Restangular.copy(post);
                                $scope.deletingPostId = $scope.activePost.id;
                                $scope.activeForm = _.find(session.forms, function (form) {
                                    return _.indexOf(form.postStreams, $scope.activePost.postStream) > -1;
                                });
                            }, 0);

                        }

                    };
                },
                link: function (scope, element, attrs, postCollectionCtrl) {
                },
                templateUrl: '/template/post/foo-post-list.html'
            };
        }
    ])
    .directive('fooPostFeed', [
        function () {
            return {
                require: '?^fooPostCollection',
                restrict: 'E',
                scope: {
                    posts: '=posts',
                    activePost: '=activePost',
                    activeForm: '=activeForm',
                    status: '=status',
                    deletingPostId: '=deletingPostId',
                    showPostForm: '=showPostForm'

                },
                link: function (scope, $element) {

                    var postForm = {};
                    scope.titles = [];
                    scope.statusTitles = [];
                    if (angular.isUndefined(scope.post)) {
                        scope.post = scope.posts.activePost;
                    }
                    if (!scope.activeForm || (scope.post.postStream !== scope.activeForm.postStream)) {

                        postForm = _.find(session.forms, function (form) {
                            return _.indexOf(form.postStreams, scope.post.postStream) > -1;
                        });

                        // If we still don't have post form then the page has been loaded directly and thus
                        // session.forms is empty
                        // Hack for now is to get the form by looking at $scope great great granparents
                        if (!postForm) {
                            postForm = scope.$parent.$parent.$parent.form;
                        }
                    } else {
                        postForm = scope.activeForm;

                    }
                    var titles = _.where(postForm.fields, {'showInList': true});


                    var fieldCount = titles.length;

                    for (var i = 0; i < fieldCount; i++) {

                        var postField = _.where(scope.post.fields, {'id': titles[i].id});

                        if (postField.length > 0) {

                            scope.titles.push(postField[0]);


                        }
                    }


                },
                controller: function ($scope, session, $timeout, Restangular) {
                    $scope.selectPost = function (post) {

                        if ($scope.activePost._id !== post._id) {
                            $scope.activePost = false;

                            $timeout(function () {
                                $scope.postView = 'feed';
                                $scope.activePost = Restangular.copy(post);
                                $scope.activeForm = _.find(session.forms, function (form) {
                                    return _.indexOf(form.postStreams, $scope.activePost.postStream) > -1;
                                });
                            }, 0);
                        }

                    };


                    $scope.showForm = function (post) {

                        $timeout(function () {
                            $scope.showPostForm = true;
                        }, 0);
                    };

                },
                link: function (scope, element, attrs, postCollectionCtrl) {
                },
                templateUrl: '/template/post/foo-post-feed.html'
            };
        }]).directive('fooPostGrid', [
        function () {
            return {
                require: '?^fooPostCollection',
                restrict: 'E',
                scope: {
                    posts: '=posts',
                    activePost: '=activePost',
                    activeForm: '=activeForm',
                    status: '=status',
                    gridHeadings: '=gridHeadings',
                    deletingPostId: '=deletingPostId',
                    showPostForm: '=showPostForm'
                },
                controller: function ($scope, session, $timeout, Restangular) {
                    $scope.selectPost = function (post) {
                        if ($scope.showPostForm && $scope.activePost._id === post._id) {
                            $scope.showPostForm = false;
                        } else {
                            $scope.activePost = false;

                            $timeout(function () {
                                $scope.activePost = Restangular.copy(post);
                                $scope.showPostForm = true;

                                $scope.activeForm = _.find(session.forms, function (form) {
                                    return _.indexOf(form.postStreams, $scope.activePost.postStream) > -1;
                                });
                            }, 0);


                        }
                    };
                },
                link: function (scope, element, attrs, postCollectionCtrl) {
                },
                templateUrl: '/template/post/foo-post-grid.html'
            };
        }])
    .directive('fooPostGridCell', [
        function () {
            return {
                require: '?^fooPostCollection',
                restrict: 'A',
                scope: {
                    cell: '=cell',
                    row: '=row',
                    formField: '='
                },
                controller: function ($scope, session) {


                },
                link: function (scope, element, attrs, postCollectionCtrl) {
                    var blankCell = {
                        value: '',
                        type: 'text'
                    };

                    var hasField = _.where(scope.row.fields, {id: scope.cell.id});
                    if (hasField.length > 0) {
                        scope.formField = hasField[0];
                    } else {
                        scope.formField = blankCell;
                    }

                },
                templateUrl: "/template/post/foo-post-grid-cell.html"

            };
        }])
    .directive('feedHeader', ['session', function (session) {

        return {
            restrict: 'E',
            scope: false,


            link: function (scope, $element) {

                var postForm = {};
                scope.titles = [];
                scope.statusTitles = [];
                if (angular.isUndefined(scope.post)) {
                    scope.post = scope.posts.activePost;
                }
                if (!scope.activeForm || (scope.post.postStream !== scope.activeForm.postStream)) {
                    postForm = _.find(session.forms, function (form) {
                        return _.indexOf(form.postStreams, scope.post.postStream) > -1;
                    });                    // If we still don't have post form then the page has been loaded
                    // directly and thus session.forms is empty
                    // Hack for now is to get the form by looking at $scope great great granparents
                    if (!postForm) {
                        postForm = scope.$parent.$parent.$parent.form;
                    }
                } else {
                    postForm = scope.activeForm;

                }
                var titles = _.where(postForm.fields, {'showInList': true});


                var fieldCount = titles.length;

                for (var i = 0; i < fieldCount; i++) {

                    var postField = _.where(scope.post.fields, {'id': titles[i].id});

                    if (postField.length > 0) {
                        postField[0].label = titles[i].label;
                        if (postField[0].type == 'status') {
                            scope.statusTitles.push(postField[0]);
                        } else {
                            scope.titles.push(postField[0]);
                        }

                    }
                }


            },
            replace: false,
            templateUrl: '/template/post/feed-header.html'
        };

    }]).directive('feedBody', ['session', function (session) {

        return {
            restrict: 'E',
            scope: false,


            link: function (scope, $element) {

                var postForm = {};
                scope.feedTitles = [];
                if (angular.isUndefined(scope.post)) {
                    scope.post = scope.posts.activePost;
                }
                if (!scope.activeForm || (scope.post.postStream !== scope.activeForm.postStream)) {
                    postForm = _.find(session.forms, function (form) {
                        return _.indexOf(form.postStreams, scope.post.postStream) > -1;
                    });
                    // If we still don't have post form then the page has been loaded directly and thus Session.forms is empty
                    // Hack for now is to get the form by looking at $scope great great granparents
                    if (!postForm) {
                        postForm = scope.$parent.$parent.$parent.form;
                    }
                } else {
                    postForm = scope.activeForm;

                }
                var titles = _.where(postForm.fields, {'showInFeed': true});


                var fieldCount = titles.length;

                for (var i = 0; i < fieldCount; i++) {

                    var postField = _.where(scope.post.fields, {'id': titles[i].id});

                    if (postField.length > 0) {
                        postField[0].label = titles[i].label;
                        scope.feedTitles.push(postField[0]);


                    }
                }


            },
            replace: false,
            templateUrl: '/template/post/feed-body.html'
        };

    }])
    .directive('fooPostCalendar', [
        function () {
            return {
                require: '?^fooPostCalendar',
                restrict: 'E',
                scope: {
                    posts: '=posts',
                    activePost: '=activePost',
                    activeForm: '=activeForm',
                    status: '=status',
                    deletingPostId: '=deletingPostId',
                    showPostForm: '=showPostForm'
                },
                controller: function ($scope, Session, $timeout, Restangular) {
                    $scope.selectPost = function (post) {
                        if ($scope.showPostForm && $scope.activePost._id === post._id) {
                            $scope.showPostForm = false;
                        } else {
                            $scope.activePost = false;

                            $timeout(function () {
                                $scope.activePost = Restangular.copy(post);
                                $scope.showPostForm = true;

                                $scope.activeForm = _.find(Session.forms, function (form) {
                                    return _.indexOf(form.postStreams, $scope.activePost.postStream) > -1 ? true : false;
                                });
                            }, 0);


                        }
                    };
                },
                link: function (scope, element, attrs, postCollectionCtrl) {
                },
                templateUrl: '/template/post/foo-post-calendar.html'
            };
        }]);


