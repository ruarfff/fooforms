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
                draggable: '=',
                ngBorder: '&'
            },
            link: function(scope, element, attrs){
                element.draggable({
                    connectToSortable: attrs.draggableTarget,
                    helper: "clone",
                    revert: "invalid",
                    start: function() {
                        DragDropHandler.dragObject = scope.draggable;
                        scope.ngBorder({'show': true});

                    },
                    stop: function() {
                        DragDropHandler.dragObject = undefined;
                        scope.ngBorder({'show': false});
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
                ngCreate: '&',
                ngBorder: '&'

            },
            link: function(scope, element, attrs){
                element.sortable();
                element.disableSelection();
                element.on("sortstart", function (event, ui) {

                    scope.$parent.showBorders(true);

                });
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

// not used but may be useful some day......

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