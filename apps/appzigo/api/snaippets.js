	
	var results;
	var MongoClient = require('../mongodb').MongoClient
	    , format = require('util').format;    
	// Retrieve
	  MongoClient.connect(mongourl, function(err, db) {
	if(err){

	res.send("we not got a connection" )
	}else{
	    var collection = db.collection('clouds');
	    collection.insert({a: req.query.id, b: 'somestring'}, function(err, docs) {
	      collection.count(function(err, count) {
	        console.log(format("count = %s", count));
	      });
	      // Locate all the entries using find
	      collection.find().toArray(function(err, results) {
	        console.dir(results);
	var html='<br>';
	for (var i = 0; i < results.length; i++) {
	    html=results[i].a +'=' + results[i].b + '  and the id= '+  results[i]._id + '<br>'+html;
	    //Do something
	}

			
	        // Let's close the db
	        db.close();
	      });      
	    });

	}

	  });