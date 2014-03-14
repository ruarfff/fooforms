/* Controllers */

fooformsApp.controller('appViewerCtrl', ['$scope', '$http' , '$modal', 'Restangular', 'appService', function ($scope, $http, $modal, Restangular, appService) {
    "use strict";
    Restangular.setBaseUrl('/api');
    Restangular.setDefaultHeaders({'Content-Type': 'application/json'});
    var appApi = Restangular.all('apps');
    var postApi = Restangular.all('posts');


    // the main object to store the app data
    $scope.app = appService.getApp();

    // some booleans to help track what we are editing, which tabs to enable, etc.
    // used in ng-show in appBuilderMenu

    var getPosts = function () {
        postApi.getList().then(function (posts) {
            $scope.posts = posts;
            $scope.postObj = $scope.posts[0]
        });
    };

    // Get all the existing apps and save them in the scope
    getPosts();


// End Icon Selection -  Modal Dialog

    $scope.savePost = function (postToSave) {
        console.log(JSON.stringify(postToSave));
        if (postToSave._id !== null) {
            // Post already exists on server
            postToSave.put().then(function (res) {
                console.log('update');
                getPosts();
            }, function (err) {
                console.log(err.status);
            });
        } else {
            postApi.post(postToSave).then(function (res) {
                console.log(JSON.stringify(res));
                $scope.postObj = res;
                getPosts();
            }, function (err) {
                console.log(err.status);
            });
        }
    };

    $scope.newPost = function () {
        $scope.postObj = angular.copy($scope.app);
        $scope.postObj._id = null;
    }

    $scope.viewPost = function (postIndex) {
        $scope.postObj = $scope.posts[postIndex];
    }

}])
;


