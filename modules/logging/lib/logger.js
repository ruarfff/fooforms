/* jslint node: true */
'use strict';

var log4js = require('log4js');
var path = require('path');

log4js.configure({
    "appenders": [
        {
            type: "console"
        },
        {
            "type": "file",
            "filename": path.join( global.config.root, "logs/fooforms.log" ),
            "maxLogSize": 1024,
            "backups": 3,
            "category": "fooforms"
        }
    ]
});
var logger = log4js.getLogger('fooforms');
logger.setLevel('DEBUG');
Object.defineProperty(exports, "LOG", {
    value: logger
});
