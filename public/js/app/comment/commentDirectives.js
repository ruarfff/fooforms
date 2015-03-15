/* global angular */

angular.module('comment')
    .directive('fooCommentCollection', [
        function () {
            return {
                restrict: 'E',
                scope: {activePost: '=activePost'},
                transclude: true,
                controller: function ($log, $scope, _, CommentService) {
                    var currentPage = 0;
                    var pageSize = 10;
                    var hasMore = true;

                    $scope.comment = {};
                    $scope.comments = [];

                    $scope.$watch('activePost', function (newValue, oldValue) {
                        if (newValue.commentStream != oldValue.commentStream) {
                            currentPage = 0;
                            pageSize = 10;
                            hasMore = true;

                            $scope.comment = {};
                            $scope.comments = [];
                            getComments(currentPage, pageSize, $scope.activePost.commentStream);
                        }
                    });


                    var getComments = function (page, pageSize, stream) {

                        if (stream) {
                            CommentService.listByStream({
                                commentStream: stream,
                                page: page,
                                pageSize: pageSize
                            }, function (err, comments) {
                                if (err) {
                                    $log.error(err);
                                }
                                if (comments) {
                                    hasMore = comments.has_more;
                                    $scope.comments = $scope.comments.concat(comments);
                                }
                            });

                        } else {
                            $log.debug('Could not load comments. No comment stream provided.');
                        }
                    };

                    $scope.addMore = function () {
                        if (hasMore) {
                            currentPage = currentPage + 1;
                            getComments(currentPage, pageSize, $scope.activePost.commentStream);
                        }
                    };

                    $scope.postComment = function () {
                        try {
                            if ($scope.comment.content) {
                                $scope.comment.commentStream = $scope.activePost.commentStream;
                                CommentService.create($scope.comment, function (err, comment) {
                                    if (err) {
                                        $log.error(err);
                                    }
                                    if (comment) {
                                        $scope.comments.push(comment);
                                        $scope.comment = {};
                                    }
                                });
                            }
                        } catch (err) {
                            $log.error(err);
                        }
                    };

                },
                templateUrl: '/template/comment/foo-comment-collection.html'
            };
        }
    ]);