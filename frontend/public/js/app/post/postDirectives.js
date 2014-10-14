angular.module('post')
    // For rendering a collection of posts
    .directive('fooPostCollection', [
        function () {
            return {
                restrict: 'E',
                scope: {view: '@', streams: '@', activePost: '=post'},
                transclude: true,
                controller: function ($scope, PostService, _, Session) {
                    var currentPostPage = 0;
                    var postPageSize = 10;
                    var hasMorePosts = true;

                    $scope.noUserForms = Session.user.defaultFolder.forms.length === 0;

                    $scope.posts = [];

                    var getPosts = function (page, pageSize, postStreams) {

                        PostService.getPostsByStreamList({
                            postStreams: postStreams,
                            page: page,
                            pageSize: pageSize
                        }, function (err, posts) {
                            if (err) {
                                $log.error(err);
                            }
                            hasMorePosts = posts.has_more;
                            if ($scope.posts) {
                                $scope.posts = $scope.posts.concat(posts);
                            } else {
                                $scope.posts = posts;
                            }
                            $scope.activePost = $scope.posts[0];

                        });

                    };

                    $scope.addMorePosts = function () {
                        if (hasMorePosts) {
                            currentPostPage = currentPostPage + 1;
                            getPosts(currentPostPage, postPageSize, $scope.streams);
                        }
                    };

                    $scope.viewPost = function (index) {
                        $scope.activePost = $scope.posts[index];
                    };


                    this.activePost = $scope.activePost;


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
                scope: {activePost: '=post'},
                controller: function ($scope) {

                },
                templateUrl: '/template/post/foo-post.html'
            };
        }
    ]);

/** TODO: These are not used yet but should be eventually
 .directive('fooPostList', [
 function () {
            return {
                require: '?^fooPostCollection',
                restrict: 'E',
                scope: { posts: '=', view: '@'},
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
                scope: {view: '=', posts: '='},
                link: function (scope, element, attrs, postCollectionCtrl) {
                },
                templateUrl: '/template/post/foo-post-feed.html'
            };
        }])
 */

