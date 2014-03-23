fooformsApp.factory('CloudService', function (Restangular, Clouds) {
    var cloudApi = Restangular.all('clouds');
    return {
        getClouds: function (next) {
            cloudApi.getList().then(function (clouds) {
                Clouds.updateAll(clouds);
                next();
            }, function (err) {
                // TODO: Handle error
                console.log(err.status);
                next(err);
            });
        },
        createCloud: function (cloud, next) {
            cloudApi.post(cloud).then(function (res) {
                Clouds.addOne(res.data);
                next();
            }, function (err) {
                // TODO: Handle error
                console.log(err.status);
                next(err);
            });
        },
        updateCloud: function (cloud, next) {
            cloud.put().then(function (res) {
                Clouds.updateOne(res.data);
                next();
            }, function (err) {
                // TODO: Handle error
                console.log(err.status);
                next(err);
            });
        },
        deleteCloud: function (cloud, next) {
            cloud.remove().then(function (res) {
                Clouds.removeOne(res.data);
                next();
            }, function (err) {
                console.log(err.status);
                next(err);
            });
        }
    };
});

fooformsApp.service('Clouds', function () {
    this.updateAll = function (clouds) {
        this.clouds = clouds;

        this.privateClouds = [];
        this.publicClouds = [];

        var index;
        var count = this.clouds.length;

        for (index = 0; index < count; index++) {
            if (this.clouds[index].isPrivate) {
                this.privateClouds.push(clouds[index]);
            } else {
                this.publicClouds.push(clouds[index]);
            }
        }
    };
    this.addOne = function (cloud) {
        if (cloud.isPrivate) {
            this.privateClouds.push(cloud);
        } else {
            this.publicClouds.push(cloud);
        }
    };
    this.updateOne = function (cloud) {
        var index;
        var count = this.clouds.length;

        for (index = 0; index < count; index++) {
            if(this.clouds[index]._id == cloud._id) {
                this.clouds[index] = cloud;
            }
        }
        this.updateAll(this.clouds);
    };
    this.removeOne = function (cloud) {
        var index;
        var count = this.clouds.length;

        for (index = 0; index < count; index++) {
            if(this.clouds[index]._id == cloud._id) {
                this.clouds.splice(index, 1);
            }
        }
        this.updateAll(this.clouds);
    };
    return this;
});