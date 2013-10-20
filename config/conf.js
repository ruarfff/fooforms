var openshiftDbConfig = {
    "hostname": process.env.OPENSHIFT_MONGODB_DB_HOST,
    "port": process.env.OPENSHIFT_MONGODB_DB_PORT,
    "username": "admin",
    "password": "hE6DLZs5m4C4",
    "name": "admin",
    "db": "fooforms"
};

var devDbConfig = {
    "hostname": 'localhost',
    "port": '27017',
    "username": "",
    "password": "",
    "name": "",
    "db": "test"
};

exports.mongo = (typeof process.env.OPENSHIFT_APP_NAME !== 'undefined') ? openshiftDbConfig : devDbConfig;

