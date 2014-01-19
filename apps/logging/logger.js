var log4js = require('log4js');
var config = require('../../config/config');
var path = require('path');

log4js.configure({
    appenders: [
        { type: 'console' },
        { type: 'file', filename: path.join(config.root, "logs/fooforms.log"), category: 'fooforms' }
    ]
});
var logger = log4js.getLogger('fooforms');
logger.setLevel('DEBUG');
Object.defineProperty(exports, "LOG", {
    value: logger
});