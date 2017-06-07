var MONGODB;
var MONGODB_USER;
var MONGODB_PASSWORD;

if (process.env.MONGODB_SERVICE_HOST) {
    MONGODB = 'mongodb://' + process.env.MONGODB_SERVICE_HOST + ':' + process.env.MONGODB_SERVICE_PORT + '/';
    MONGODB_USER = process.env.MONGODB_USER;
    MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
} else {
    MONGODB = 'mongodb://192.168.1.190:27024/';
}

module.exports = {
    database: MONGODB + 'nodekb',
    mongodbUser: MONGODB_USER,
    mongodbPass: MONGODB_PASSWORD
}