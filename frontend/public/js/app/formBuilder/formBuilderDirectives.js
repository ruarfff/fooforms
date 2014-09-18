/* global angular */

angular.module('formBuilder')

    .factory('DragDropHandler', [function ($scope) {
        'use strict';
        return {
            dragObject: undefined,
            addObject: function (object, objects, to) {
                objects.splice(to, 0, object);
            },
            moveObject: function (objects, from, to) {
               // objects.splice(to, 0, objects.splice(from, 1)[0]);
            }
        };
    }])



    .directive('draggable', ['DragDropHandler', function (DragDropHandler) {
        'use strict';
        return {
            scope: {
                draggable: '=',
                ngBorder: '&'
            },
            link: function (scope, element, attrs) {
                element.draggable({
                    connectToSortable: attrs.draggableTarget,
                    helper: "clone",
                    revert: "invalid",
                    start: function () {
                        DragDropHandler.dragObject = scope.draggable;
                        scope.ngBorder({'show': true});

                    },
                    stop: function () {
                        DragDropHandler.dragObject = undefined;
                        scope.ngBorder({'show': false});
                        scope.$parent.$apply();
                    }
                });

                element.disableSelection();
            }
        };
    }])

    .directive('droppable', ['DragDropHandler', function (DragDropHandler) {
        'use strict';
        return {
            scope: {
                droppable: '=',
                ngUpdate: '&',
                ngCreate: '&',
                ngBorder: '&'

            },
            link: function (scope, element, attrs) {
                element.sortable();
                element.disableSelection();
                element.on("sortstart", function (event, ui) {

                    scope.$parent.showBorders(true);

                });
                element.on("sortdeactivate", function (event, ui) {

                        var from = angular.element(ui.item).scope().$index;
                        scope.$parent.nowEditing = from;
                        var to = element.children().index(ui.item);
                        scope.$apply(function(){
                            if (to >= 0) {

                                if (from >= 0) {
                                    //DragDropHandler.moveObject(scope.droppable, from, to);

                                    scope.ngUpdate({
                                        from: from,
                                        to: to
                                    });



                                } else {
                                    scope.ngCreate({
                                        object: DragDropHandler.dragObject,
                                        to: to
                                    });
                                    ui.item.remove();

                                }


                            }
                        });



                });

            }
        };
    }])

// not used but may be useful some day......

    .directive('compile', function ($compile) {
        'use strict';
        // directive factory creates a link function
        return function (scope, element, attrs) {
            scope.$watch(
                function (scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compile);
                },
                function (value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);

                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);
                }
            );
        };
    })


    .directive('subdroppable', ['DragDropHandler', function (DragDropHandler) {
        'use strict';
        return {
            scope: {
                subdroppable: '=',
                ngUpdate: '&',
                ngCreate: '&',
                ngBorder: '&'

            },
            link: function (scope, element, attrs) {

                element.sortable();
                element.disableSelection();
                element.on("sortstart", function (event, ui) {

                    scope.$parent.showBorders(true);

                });
                element.on("sortdeactivate", function (event, ui) {
                    var repeatBox = angular.element(ui.item).scope().$index;
                    var from = angular.element(ui.item).scope().$index;
                    var to = element.children().index(ui.item);

                    scope.$parent.nowEditing = from;
                    scope.$parent.nowSubEditing = repeatBox;

                    if (to >= 0) {
                        scope.$apply(function () {
                            if (angular.element(ui.item).scope().subField !== undefined) {
                                DragDropHandler.moveObject(scope.subdroppable, from, to);
                                scope.ngUpdate({
                                    from: from,
                                    to: to
                                });

                            } else {
                                scope.ngCreate({
                                    object: DragDropHandler.dragObject,
                                    repeatbox: repeatBox,
                                    to: to
                                });

                                ui.item.remove();
                            }
                        });
                    }
                    event.stopPropagation();
                    scope.$parent.$apply();
                });
            }
        };
    }]).directive('uploader', ['$upload',function($upload) {

        return {
            restrict: 'E',
            scope: {

                formField: '=formField',
                message: '=message',
                onFileSelect: "&onFileSelect",
                doFileUpload: "&doFileUpload"

            },
            link: function(scope, elem, attrs, ctrl) {


                scope.onFileSelect= function(selectedFile){

                    scope.uploadFile = selectedFile[0];


                    scope.doFileUpload();

                };

                scope.doFileUpload = function(){


                    scope.upload = $upload.upload({
                        url: '/api/file', //upload.php script, node.js route, or servlet url
                        // method: POST or PUT,
                        // headers: {'header-key': 'header-value'},
                        // withCredentials: true,
                        data: {file: scope.uploadFile}

                    }).progress(function(evt) {
                        scope.formField.progress = (parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function(data, status, headers, config) {
                        // file is uploaded successfully
                        scope.uploadFile = [];
                        scope.allowUpload = null;
                        if (data.err){
                            setMessage(true,'File Failed Validation',data.err,'alert-danger');

                        }else{
                            scope.formField.value = data;

                        }

                    }).error(function(err){
                        alert(err);
                    });



                }

            },
            replace: false,
            templateUrl: '/partials/uploader.html'
        };

    }]).directive('profileUploader', ['$upload',function($upload) {

        return {
            restrict: 'E',
            scope: {

                user: '=user',
                message: '=message',
                onFileSelect: "&onFileSelect",
                doFileUpload: "&doFileUpload"

            },
            link: function(scope, elem, attrs, ctrl) {


                scope.onFileSelect= function(selectedFile){

                    scope.uploadFile = selectedFile[0];


                    scope.doFileUpload();

                };

                scope.doFileUpload = function(){


                    scope.upload = $upload.upload({
                        url: '/api/file', //upload.php script, node.js route, or servlet url
                        // method: POST or PUT,
                        // headers: {'header-key': 'header-value'},
                        // withCredentials: true,
                        data: {file: scope.uploadFile}

                    }).progress(function(evt) {
                        //scope.formField.progress = (parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function(data, status, headers, config) {
                        // file is uploaded successfully
                        scope.uploadFile = [];
                        scope.allowUpload = null;
                        if (data.err){
                            setMessage(true,'File Failed Validation',data.err,'alert-danger');

                        }else{
                            scope.user.photo= data._id;

                        }

                    }).error(function(err){
                        alert(err);
                    });



                }

            },
            replace: false,
            templateUrl: '/partials/profileUploader.html'
        };

    }]);