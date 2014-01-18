var path = require('path');

var rootPath = path.normalize(__dirname + '/../..');

var devDbConfig = {
    "hostname": 'localhost',
    "port": '27017',
    "username": "",
    "password": "",
    "name": "",
    "db": "test"
};

module.exports = {
    root: rootPath,
    port: process.env.PORT || 3000,
    database: devDbConfig
}

