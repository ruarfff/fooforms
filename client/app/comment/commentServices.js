angular.module('fooforms.comment')
    .factory('commentService',
    ['$log', 'Restangular',
        function ($log, Restangular) {
            'use strict';
            var commentApi = Restangular.all('comments');
            return {
                listByStream: function (args, next) {
                    var commentStream = args.commentStream;
                    var page = args.page || 1;
                    var pageSize = args.pageSize || 10;
                    if (!commentStream) {
                        return next(new Error('PostStreams are required to get posts'));
                    }
                    commentApi.getList({
                        commentStream: commentStream,
                        page: page,
                        pageSize: pageSize
                    }).then(function (comments) {
                        return next(null, comments);
                    }, function (err) {
                        $log.error(err);
                        return next(err);
                    });
                },
                create: function (comment, next) {
                    if (typeof comment.post !== 'function') {
                        comment = Restangular.restangularizeElement(commentApi, comment, '');
                    }
                    commentApi.post(comment).then(function (res) {
                        return next(null, res);
                    }, function (err) {
                        $log.error(err);
                        return next(err);
                    });
                },
                update: function (comment, next) {
                    if (typeof comment.put !== 'function') {
                        comment = Restangular.restangularizeElement(commentApi, comment, '');
                    }
                    comment.put().then(function (res) {
                        return next(null, res);
                    }, function (err) {
                        $log.error(err);
                        return next(err);
                    });
                },
                delete: function (comment, next) {
                    if (typeof comment.remove !== 'function') {
                        comment = Restangular.restangularizeElement(commentApi, comment, '');
                    }
                    comment.remove().then(function () {
                        return next(null);
                    }, function (err) {
                        $log.error(err);
                        return next(err);
                    });
                }
            };
        }]);

