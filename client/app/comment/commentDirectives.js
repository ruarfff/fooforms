angular.module('fooforms.comment')
    .directive('fooCommentCollection', ['session',
        function (session) {
            return {
                restrict: 'E',
                scope: {
                    activePost: '=activePost',
                    activeForm: '=activeForm'
                },
                transclude: true,

                controller: function ($log, $scope, _, commentService) {
                    var currentPage = 0;
                    var pageSize = 10;
                    var hasMore = true;

                    $scope.comment = {};
                    $scope.comments = [];
                    $scope.postTitle ='';
                    $scope.fetchingComments=false;
                    $scope.showCommentButton = false;

                    $scope.$watch('activePost', function (newValue, oldValue) {
                        if (newValue && (newValue.commentStream != oldValue.commentStream)) {
                            currentPage = 0;
                            pageSize = 10;
                            hasMore = true;

                            $scope.comment = {};
                            $scope.comments = [];
                            $scope.postTitle ='';

                            getComments(currentPage, pageSize, $scope.activePost.commentStream);
                        }
                    });


                    var getComments = function (page, pageSize, stream) {
                        $scope.fetchingComments=true;

                        if (stream) {
                            commentService.listByStream({
                                commentStream: stream,
                                page: page,
                                pageSize: pageSize
                            }, function (err, comments) {
                                if (err) {
                                    $log.error(err);
                                }
                                if (comments) {
                                    $scope.fetchingComments=false;
                                    hasMore = comments.has_more;
                                    $scope.comments = $scope.comments.concat(comments);
                                    getPostTitle();
                                }

                            });

                        } else {
                            $log.debug('Could not load comments. No comment stream provided.');
                            $scope.fetchingComments=false;
                        }
                    };


                    var getPostTitle = function(){
                        var postForm={};
                        $scope.titles=[];

                        if (!$scope.activeForm || ($scope.activePost.postStream !== $scope.activeForm.postStreams[0])) {
                            postForm = _.find(session.forms, function (form) {
                                return form.postStreams[0]== $scope.activePost.postStream;
                            });
                        }else{
                            postForm =$scope.activeForm ;

                        }
                        var titles = _.where(postForm.fields, {'showInList': true});


                        var fieldCount = titles.length;

                        for (var i=0;i<fieldCount;i++){

                            var postField = _.where($scope.activePost.fields, {'id': titles[i].id});

                            if (postField.length>0 && postField[0].type!=='status'){

                                    $scope.titles.push(postField[0]);
                                }

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
                                commentService.create($scope.comment, function (err, comment) {
                                    if (err) {
                                        $log.error(err);
                                    }
                                    if (comment) {
                                        comment.commenter = {photo: session.user.photo};
                                        $scope.comments.unshift(comment);
                                        $scope.comment = {};
                                    }
                                });
                            }
                        } catch (err) {
                            $log.error(err);
                        }
                    };
                    $scope.likePost = function () {
                        try {
                            var comment = {};
                            var user = "";
                            if (session.user.name && session.user.name.givenName && session.user.name.familyName) {
                                user = session.user.name.givenName + ' ' + session.user.name.familyName;
                            }else{
                                user = session.user.displayName;
                            }

                            comment.content= user + " likes this...";
                            comment.commentStream = $scope.activePost.commentStream;
                            commentService.create(comment, function (err, comment) {
                                if (err) {
                                    $log.error(err);
                                }
                                if (comment) {
                                    comment.commenter = {photo: session.user.photo};
                                    $scope.comments.unshift(comment);
                                    $scope.comment = {};
                                }
                            });

                        } catch (err) {
                            $log.error(err);
                        }
                    };

                    $scope.toggleCommentBox = function(){

                        $scope.showCommentButton = !!(!$scope.showCommentButton || $scope.comment.content);

                    }

                },
                templateUrl: '/template/comment/foo-comment-collection.html'
            };
        }
    ]);
