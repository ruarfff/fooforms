/*jslint node: true */

var File = require('../models/file').File;
var log = require('fooforms-logging').LOG;
var fs = require('fs');
var csv = require('csv');
var parse = csv.parse;
var transform = csv.transform;

exports.importFile = function (uploadedFile, next) {
    "use strict";

    try {
       var csv2Json = [];
        var parser = parse({},function(err,csv2Json){

            for (var i = 0; i < csv2Json.length; i++) {
                if (i==0){
                    csv2Json[i] ={'id': 'Header', 'items': csv2Json[i]} ;
                }else{
                    csv2Json[i] ={'id': i , 'items': csv2Json[i]} ;
                    }


            }

           next(err,csv2Json);
        });




        var input = fs.createReadStream(uploadedFile.path);

        input.pipe(parser);
    } catch (err) {
        log.error(__filename, ' - ', err);
        next(err, null);
    }

};
