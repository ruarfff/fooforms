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
                    status: '=status',
                    team: '=team',
                    gridHeadings: '=gridHeadings',
                    showPostForm: '=showPostForm'
                },
                transclude: true,
                controller: function ($log, $scope, PostService, _, Session) {
                    var currentPostPage = 0;
                    var postPageSize = 15;
                    var hasMorePosts = true;
                    $scope.fetching=true;
                    $scope.showIntroPage=false;
                    $scope.view='list';

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


                                if ($scope.posts.length > 0 && !$scope.activePost) {
                                    $scope.activePost = $scope.posts[0];
                                }

                                if (!$scope.activeForm){

                                    $scope.activeForm =_.find(Session.forms, function(form){
                                        return _.indexOf(form.postStreams, $scope.activePost.postStream) > -1 ? true: false;
                                    });

                                }


                            });

                        } else {
                            $scope.fetching=false;
                            $scope.showIntroPage=true;
                            $scope.$parent.postView='list';
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
                controller: function($scope){
                    $scope.addRepeat = function (groupBox, field) {
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
                    status: '=status'
                },
                controller: function ($scope, Session) {
                    $scope.selectPost = function (post) {
                        $scope.postView='list';
                        $scope.activePost = post;
                        $scope.activeForm =_.find(Session.forms, function(form){
                            return _.indexOf(form.postStreams, $scope.activePost.postStream) > -1 ? true: false;
                        });

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
                    showPostForm: '=showPostForm'

                },
                link: function (scope, $element) {

                    var postForm={};
                    scope.titles =[];
                    scope.statusTitles =[];
                    if (angular.isUndefined(scope.post)) {
                        scope.post = scope.posts.activePost;
                    }
                    if (!scope.activeForm || (scope.post.postStream !== scope.activeForm.postStream)) {

                        postForm =_.find(Session.forms, function(form){
                            return _.indexOf(form.postStreams, scope.post.postStream) > -1 ? true: false;
                        });

                        // If we still don't have post form then the page has been loaded directly and thus Session.forms is empty
                        // Hack for now is to get the form by looking at $scope great great granparents
                        if (!postForm){
                            postForm = scope.$parent.$parent.$parent.form;
                        }
                    }else{
                        postForm =scope.activeForm ;

                    }
                    var titles = _.where(postForm.fields, {'showInList': true});


                    var fieldCount = titles.length;

                    for (var i=0;i<fieldCount;i++){

                        var postField = _.where(scope.post.fields, {'id': titles[i].id});

                        if (postField.length>0){

                                scope.titles.push(postField[0]);


                        }
                    }


                },
                controller: function ($scope, Session, CommentService) {
                    $scope.selectPost = function (post) {
                        $scope.postView='feed';
                        $scope.activePost = post;
                        $scope.activeForm =_.find(Session.forms, function(form){
                            return _.indexOf(form.postStreams, $scope.activePost.postStream) > -1 ? true: false;
                        });
                    };

                    $scope.showForm = function (post) {

                            $scope.activePost = post;
                            $scope.showPostForm=true;

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
                    showPostForm: '=showPostForm'
                },
                controller: function ($scope, Session) {
                    $scope.selectPost = function (post) {
                        if($scope.showPostForm && $scope.activePost._id===post._id){
                            $scope.showPostForm=false;
                        }else{
                            $scope.activePost = post;
                            $scope.showPostForm=true;
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
                controller: function ($scope, Session) {


                },
                link: function (scope, element, attrs, postCollectionCtrl) {
                    var blankCell = {
                        value:'',
                        type:'text'
                    };

                    var hasField = _.where(scope.row.fields,{id: scope.cell.id});
                    if (hasField.length>0){
                        scope.formField = hasField[0];
                    }else{
                        scope.formField = blankCell;
                    }

                },
                templateUrl: "/template/post/foo-post-grid-cell.html"

            };
        }])
    .directive('feedHeader', ['Session',function (Session) {

        return {
            restrict: 'E',
            scope: false,


            link: function (scope, $element) {

                var postForm={};
                scope.titles =[];
                scope.statusTitles =[];
                if (angular.isUndefined(scope.post)) {
                    scope.post = scope.posts.activePost;
                }
                if (!scope.activeForm || (scope.post.postStream !== scope.activeForm.postStream)) {
                    postForm =_.find(Session.forms, function(form){
                        return _.indexOf(form.postStreams, scope.post.postStream) > -1 ? true: false;
                    });                    // If we still don't have post form then the page has been loaded directly and thus Session.forms is empty
                    // Hack for now is to get the form by looking at $scope great great granparents
                    if (!postForm){
                        postForm = scope.$parent.$parent.$parent.form;
                    }
                }else{
                    postForm =scope.activeForm ;

                }
                var titles = _.where(postForm.fields, {'showInList': true});


                var fieldCount = titles.length;

                 for (var i=0;i<fieldCount;i++){

                     var postField = _.where(scope.post.fields, {'id': titles[i].id});

                      if (postField.length>0){
                          postField[0].label = titles[i].label;
                          if (postField[0].type=='status'){
                              scope.statusTitles.push(postField[0]);
                          }else{
                              scope.titles.push(postField[0]);
                          }

                      }
                 }


            },
            replace: false,
            templateUrl: '/template/post/feed-header.html'
        };

    }]).directive('feedBody', ['Session',function (Session) {

        return {
            restrict: 'E',
            scope: false,


            link: function (scope, $element) {

                var postForm={};
                scope.feedTitles =[];
                  if (angular.isUndefined(scope.post)) {
                    scope.post = scope.posts.activePost;
                }
                if (!scope.activeForm || (scope.post.postStream !== scope.activeForm.postStream)) {
                    postForm =_.find(Session.forms, function(form){
                        return _.indexOf(form.postStreams, scope.post.postStream) > -1 ? true: false;
                    });
                    // If we still don't have post form then the page has been loaded directly and thus Session.forms is empty
                    // Hack for now is to get the form by looking at $scope great great granparents
                    if (!postForm){
                        postForm = scope.$parent.$parent.$parent.form;
                    }
                }else{
                    postForm =scope.activeForm ;

                }
                var titles = _.where(postForm.fields, {'showInFeed': true});


                var fieldCount = titles.length;

                for (var i=0;i<fieldCount;i++){

                    var postField = _.where(scope.post.fields, {'id': titles[i].id});

                    if (postField.length>0){
                        postField[0].label = titles[i].label;
                       scope.feedTitles.push(postField[0]);


                    }
                }


            },
            replace: false,
            templateUrl: '/template/post/feed-body.html'
        };

    }]);


