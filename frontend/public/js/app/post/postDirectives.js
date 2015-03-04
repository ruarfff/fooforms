angular.module('post')
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
                    status: '@',
                    team: '=team'
                },
                transclude: true,
                controller: function ($log, $scope, PostService, _, Session) {
                    var currentPostPage = 0;
                    var postPageSize = 10;
                    var hasMorePosts = true;
                    $scope.fetching=true;

                    $scope.noUserForms = Session.user.defaultFolder.forms.length === 0;

                    $scope.posts = [];

                    var getPosts = function (page, pageSize, postStreams) {
                        $scope.fetching=true;
                        if(postStreams) {
                            PostService.getPostsByStreamList({
                                postStreams: postStreams,
                                page: page,
                                pageSize: pageSize
                            }, function (err, posts) {
                                $scope.fetching=false;
                                if (err) {
                                    $log.error(err);
                                }
                                hasMorePosts = posts.has_more;
                                if (posts) {
                                    $scope.posts = $scope.posts.concat(posts);
                                }
                                if ($scope.posts.length > 0) {
                                    $scope.activePost = $scope.posts[0];
                                    $scope.activeForm = _.find(Session.forms, {displayName : $scope.activePost.displayName});

                                }

                            });

                        } else {
                            $scope.fetching=false;
                            $log.debug('Could not load posts. No post streams provided.');
                        }
                    };

                    $scope.addMorePosts = function () {
                        if (hasMorePosts) {
                            currentPostPage = currentPostPage + 1;
                            getPosts(currentPostPage, postPageSize, $scope.streams);
                            $scope.gridData = [ {'test':1},{'test2': 2}];
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
                    printPreview: '=printPreview',
                    printPost: '&printPost',
                    cancelPrint: '&cancelPrint'
                },
                controller: function($scope){
                    $scope.addRepeat = function (groupBox, field) {
                        var repeater = {};
                        repeater.id = new Date().getTime();
                        repeater.fields = angular.copy($scope.activePost.fields[groupBox].fields);

                        // need to swap out the field.id's for new ones.
                        var fieldCount = repeater.fields.length;

                        for (var fieldIndex = 0; fieldIndex < fieldCount; fieldIndex++) {
                            var fieldId = repeater.fields[fieldIndex].id
                            repeater.fields[fieldIndex].id = repeater.id + '_' + fieldId;

                            // Fields specified in calculation need filedIds updated
                            if (repeater.fields[fieldIndex].type == 'calculation') {

                                if (repeater.fields[fieldIndex].options.field1.item != 'Specified Value') {
                                    var fieldItem = repeater.fields[fieldIndex].options.field1.item;
                                    repeater.fields[fieldIndex].options.field1.item = repeater.id + '_' + fieldItem;
                                }
                                if (repeater.fields[fieldIndex].options.field2.item != 'Specified Value') {
                                    var fieldItem = repeater.fields[fieldIndex].options.field2.item;
                                    repeater.fields[fieldIndex].options.field2.item = repeater.id + '_' + fieldItem;
                                }
                            }
                        }

                        $scope.activePost.fields[groupBox].repeaters.push(repeater);

                    };
                    $scope.removeRepeat = function (groupBox, field) {

                    };
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
                    status: '@'
                },
                controller: function ($scope, Session) {
                    $scope.selectPost = function (post) {
                        $scope.activePost = post;
                        $scope.activeForm = _.find(Session.forms, {displayName : post.displayName});

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
                    status: '@'
                },
                controller: function ($scope, Session) {
                    $scope.selectPost = function (post) {
                        $scope.activePost = post;
                        $scope.activeForm = _.find(Session.forms, {displayName : post.displayName});

                    };
                },
                link: function (scope, element, attrs, postCollectionCtrl) {
                },
                templateUrl: '/template/post/foo-post-feed.html'
            };
        }]) .directive('fooPostGrid', [
        function () {
            return {
                require: '?^fooPostCollection',
                restrict: 'E',
                transclude: true,
                scope: {
                    posts: '=posts',
                    activePost: '=activePost',
                    activeForm: '=activeForm',
                    gridData: '=gridData'
                },
                controller: function ($scope,Session) {
                    $scope.selectPost = function (index) {
                        $scope.activePost = $scope.posts[index];
                        $scope.activeForm = _.find(Session.forms, {displayName : $scope.activePost.displayName});

                    };



                },
                link: function (scope, element, attrs, postCollectionCtrl) {
                },
                templateUrl: '/template/post/foo-post-grid.html'
            };
        }]).directive('feedHeader', [function () {

        return {
            restrict: 'E',
            scope: false,


            link: function (scope, Session,$element) {


                var index;
                scope.titleStr = "";
                if (angular.isUndefined(scope.post)) {
                    scope.post = scope.posts.activePost;
                }
                scope.activeForm = _.find(Session.forms, {displayName : scope.post.displayName});

                var titles = _.where(scope.post.fields, {'useAsTitle': true});
                var titlesplucked = _.pluck(titles, 'value');

                var fieldCount = titlesplucked.length;

                 for (var i=0;i<fieldCount;i++){
                      if (typeof(titlesplucked[i])=='object'){
                          scope.titleStr = scope.titleStr + ' - ' + titlesplucked[i].displayName;
                      }else{
                          scope.titleStr = scope.titleStr + ' - ' + titlesplucked[i];
                      }
                 }
                scope.titleStr = scope.titleStr.replace(' - ','');

            },
            replace: false,
            templateUrl: '/template/post/feed-header.html'
        };

    }]);


