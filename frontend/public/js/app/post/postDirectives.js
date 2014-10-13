angular.module('post')
    // For rendering a collection of posts
    .directive('fooPostCollection', [
        function () {
            return {
                restrict: 'E',
                transclude: true,
                scope: {},
                controller: function ($scope) {

                },
                templateUrl: '/template/post/foo-post-collection.html'
            };
        }
    ])
    // Used to render a selected post
    .directive('fooPost', [
        function () {
            return {
                require: '?fooPostCollection',
                restrict: 'E',
                transclude: true,
                scope: {},
                link: function (scope, element, attrs, postCollectionCtrl) {
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
                transclude: true,
                scope: {},
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
                transclude: true,
                scope: {},
                link: function (scope, element, attrs, postCollectionCtrl) {
                },
                templateUrl: '/template/post/foo-post-feed.html'
            };
        }]);
