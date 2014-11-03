/* global angular */

angular.module('post')
    .filter('statusFilter', function () {
        return function (posts, status) {
            if (!status || status === 'All') {
                return posts;
            }

            return posts.filter(function (element, index, array) {
                if (element.fields) {
                    var hasStatus = false; // Ugh.. to handle when there are posts with no status
                    for (var i = 0; i < element.fields.length; i++) {
                        if (element.fields[i].type === 'status') {
                            hasStatus = true;
                            var selected = element.fields[i].selected;
                            if (selected === status) {
                                return true;
                            }

                        }
                    }
                    return !hasStatus;
                }
                return false;
            });

        }
    });
