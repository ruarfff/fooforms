angular.module('post')
    // For rendering a collection of posts
    .directive('fooPostCollection', [
        function () {
            return {
                restrict: 'E',
                scope: {view: '@', streams: '@', activePost: '=activePost', posts: '=posts'},
                transclude: true,
                controller: function ($log, $scope, PostService, _, Session) {
                    var currentPostPage = 0;
                    var postPageSize = 10;
                    var hasMorePosts = true;

                    $scope.noUserForms = Session.user.defaultFolder.forms.length === 0;

                    $scope.posts = [];

                    var getPosts = function (page, pageSize, postStreams) {

                        if(postStreams) {
                            PostService.getPostsByStreamList({
                                postStreams: postStreams,
                                page: page,
                                pageSize: pageSize
                            }, function (err, posts) {
                                if (err) {
                                    $log.error(err);
                                }
                                hasMorePosts = posts.has_more;
                                if (posts) {
                                    $scope.posts = $scope.posts.concat(posts);
                                }
                                if ($scope.posts.length > 0) {
                                    $scope.activePost = $scope.posts[0];
                                }

                            });

                        } else {
                            $log.debug('Could not load posts. No post streams provided.');
                        }
                    };

                    $scope.addMorePosts = function () {
                        if (hasMorePosts) {
                            currentPostPage = currentPostPage + 1;
                            getPosts(currentPostPage, postPageSize, $scope.streams);
                        }
                    };

                    //this.activePost = $scope.activePost;


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
                    delete: '&deletePost',
                    copy: '&copyPost',
                    cancel: '&cancelPost',
                    save: '&savePost'
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
                    activePost: '=activePost'
                },
                controller: function ($scope) {
                    $scope.selectPost = function (index) {
                        $scope.activePost = $scope.posts[index];
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
                    activePost: '=activePost'
                },
                controller: function ($scope) {
                    $scope.selectPost = function (index) {
                        $scope.activePost = $scope.posts[index];
                    };
                },
                link: function (scope, element, attrs, postCollectionCtrl) {
                },
                templateUrl: '/template/post/foo-post-feed.html'
            };
        }]);


