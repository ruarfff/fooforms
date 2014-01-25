/*jslint node: true */
'use strict';

case
'get'
:
switch (object) {
    case 'clouds':
        //jsonResponse=getUsercloudsJSON();
        MongoClient.connect(mongourl, function (err, db) {
            if (err) {
                sendResponse(err);

            } else {

                var collection = db.collection('cloud');
                collection.find({owner: req.user._id}).toArray(function (err, clouds) {
                    if (err) {
                        sendResponse(err);
                        db.close();
                    } else {


                        sendResponse(clouds);
                        db.close();

                    }
                })

            }

        });

        break;

    case 'cloud':

        MongoClient.connect(mongourl, function (err, db) {
            if (err) {
                sendResponse(err);

            } else {

                var collection = db.collection('cloud');
                collection.find({menuLabel: req.body.item}).toArray(function (err, cloud) {
                    if (err || cloud.length == 0) {
                        sendResponse(err);
                        db.close();
                    } else {

                        var collection = db.collection('app');
                        collection.find({clouds: cloud[0]._id.toHexString()}).toArray(function (err, apps) {
                            if (err) {
                                sendResponse(err);
                                db.close();
                            } else {

                                sendResponse({cloud: cloud, apps: apps});
                                db.close();

                            }
                        })


                    }
                })

            }

        });
        break;


