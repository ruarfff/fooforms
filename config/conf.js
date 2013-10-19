var mongo;

mongo = {
    "hostname": process.env.OPENSHIFT_MONGODB_DB_HOST,
    "port": process.env.OPENSHIFT_MONGODB_DB_PORT,
    "username": "admin",
    "password": "YBVHXNVjLIzh",
    "name": "admin",
    "db": "dev"
};

exports.mongo = mongo;
