/* global angular */

angular.module('comment')
    .directive('fooCommentCollection', [
        function () {
            return {
                restrict: 'E',
                scope: {stream: '@'},
                transclude: true,
                controller: function ($log, $scope, _, CommentService) {
                    var currentPostPage = 0;
                    var postPageSize = 10;
                    var hasMore = true;

                    $scope.comment = {};
                    $scope.comments = [];


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
                            currentPostPage = currentPostPage + 1;
                            getComments(currentPostPage, postPageSize, $scope.stream);
                        }
                    };

                    $scope.postComment = function () {
                        try {
                            if ($scope.comment.content) {
                                $scope.comment.commentStream = $scope.stream;
                                CommentService.create($scope.comment, function (err, comment) {
                                    if (err) {
                                        $log.error(err);
                                    }
                                    if (comment) {
                                        $scope.comments.push(comment);
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