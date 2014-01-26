'use strict';

/* Directives */


angular.module( 'appBuilder.directives', [] )
    .factory('DragDropHandler', [function() {
        return {
            dragObject: undefined,
            addObject: function(object, objects, to) {
                objects.splice(to, 0, object);
            },
            moveObject: function(objects, from, to) {
                objects.splice(to, 0, objects.splice(from, 1)[0]);
            }
        };
    }])

    .directive('draggable', ['DragDropHandler', function(DragDropHandler) {
        return {
            scope: {
                draggable: '='
            },
            link: function(scope, element, attrs){
                element.draggable({
                    connectToSortable: attrs.draggableTarget,
                    helper: "clone",
                    revert: "invalid",
                    start: function() {
                        DragDropHandler.dragObject = scope.draggable;
                    },
                    stop: function() {
                        DragDropHandler.dragObject = undefined;
                    }
                });

                element.disableSelection();
            }
        };
    }])

    .directive('droppable', ['DragDropHandler', function(DragDropHandler) {
        return {
            scope: {
                droppable: '=',
                ngUpdate: '&',
                ngCreate: '&'
            },
            link: function(scope, element, attrs){
                element.sortable();
                element.disableSelection();
                element.on("sortdeactivate", function(event, ui) {
                    var from = angular.element(ui.item).scope().$index;
                    var to = element.children().index(ui.item);

                    if (to >= 0 ){
                        scope.$apply(function(){
                            if (from >= 0) {
                                DragDropHandler.moveObject(scope.droppable, from, to);
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
                        });
                    }
                });
            }
        };
    }])
    .directive('sortable', ['$timeout', function($timeout) {
        return {
            scope: {
                ngModel: '=',
                ngChange: '&'
            },
            link: function(scope, element, attrs) {
                var toUpdate;
                var startIndex = -1;
                element.sortable({
                    placeholder: "alert alert-info",
                    start: function (event, ui) {
                        // on start we define where the item is dragged from
                        startIndex = $(ui.item).index();
                    },
                    stop: function (event, ui) {
                        // on stop we determine the new index of the
                        // item and store it there
                        var newIndex = $(ui.item).index();
                        var toMove = toUpdate[startIndex];
                        toUpdate.splice(startIndex, 1);
                        toUpdate.splice(newIndex, 0, toMove);

                        // we move items in the array, if we want
                        // to trigger an update in angular use $apply()
                        // since we're outside angulars lifecycle
                        $timeout(function() {
                            scope.ngChange();
                        });
                    }
                });

                $timeout(function() {
                    toUpdate = scope.ngModel;
                });
            }
        }
    }])



.directive('compile', function($compile) {
    // directive factory creates a link function
    return function(scope, element, attrs) {
        scope.$watch(
            function(scope) {
                // watch the 'compile' expression for changes
                return scope.$eval(attrs.compile);
            },
            function(value) {
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