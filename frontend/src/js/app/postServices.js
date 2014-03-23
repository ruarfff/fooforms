fooformsApp.factory('PostService', function (Restangular, Posts) {
    var postApi = Restangular.all('posts');
    return {
        createPost: function (post, next) {
            postApi.post(post).then(function (res) {
                Posts.addOne(res.data);
                next(null, res.data._id);
            }, function (err) {
                // TODO: Handle error
                console.log(err.toString());
                next(err);
            });
        },
        updatePost: function (post, next) {
            post.put().then(function (res) {
                console.log('update');
                Posts.updateOne(post);
                next();
            }, function (err) {
                console.log(err.toString());
                next(err);
            });
        },
        deletePost: function (post, next) {
            post.remove().then(function (res) {
                Posts.removeOne(post);
                next();
            }, function (err) {
                console.log(err.toString());
                next(err);
            });
        },
        getUserPosts: function (next) {
            postApi.getList().then(function (posts) {
                Posts.updateAll(posts);
                next();
            }, function (err) {
                // TODO: Handle error
                console.log(err.toString());
                next(err);
            });
        },
        getCloudPosts: function (cloud, next) {
            postApi.getList(cloud._id).then(function (posts) {
                Posts.updateAll(posts);
                next();
            }, function (err) {
                // TODO: Handle error
                console.log(err.toString());
                next(err);
            });
        },
        getAppPosts: function (app, next) {
            postApi.getList(app._id).then(function (posts) {
                Posts.updateAll(posts);
                next();
            }, function (err) {
                // TODO: Handle error
                console.log(err.toString());
                next(err);
            });
        }
    };
});

fooformsApp.service('Posts', function () {
    this.updateAll = function (posts) {
        this.posts = posts;
    };
    this.addOne = function (post) {
        this.posts.push(post);
    };
    this.updateOne = function (post) {
        var index;
        var count = this.posts.length;

        for (index = 0; index < count; index++) {
            if(this.posts[index]._id == post._id) {
                this.posts[index] = post;
            }
        }
        this.updateAll(this.posts);
    };
    this.removeOne = function (post) {
        var index;
        var count = this.posts.length;

        for (index = 0; index < count; index++) {
            if(this.posts[index]._id == post._id) {
                this.posts.splice(index, 1);
            }
        }
        this.updateAll(this.posts);
    };
    this.findById = function (id) {
        var index;
        var count = this.posts.length;

        for (index = 0; index < count; index++) {
            if(this.posts[index]._id == id) {
                return this.posts[index];
            }
        }
        return null;
    };

    return this;
});