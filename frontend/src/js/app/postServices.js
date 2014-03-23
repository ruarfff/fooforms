fooformsApp.factory('PostService', function (Restangular, Posts) {
    var postApi = Restangular.all('posts');
    return {
        getPosts: function (next) {
            postApi.getList().then(function (posts) {
                Posts.updateAll(posts);
                next();
            }, function (err) {
                // TODO: Handle error
                console.log(err.status);
                next(err);
            });
        }
    };
});

fooformsApp.service('Posts', function () {
    this.updateAll = function (posts) {
        this.posts = posts;
    };

    return this;
});