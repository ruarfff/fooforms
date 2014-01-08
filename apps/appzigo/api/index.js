module.exports = function(req,res){
	var express = require('express')
	, passport = require('../node_modules/passport')
	, mongoose = require('../node_modules/mongoose')

	, Schema = mongoose.Schema;

	var UserSchema = new Schema({
		provider: String,
		uid: String,
		displayName: String,
		photo: String,
		created: {type: Date, default: Date.now}
	});

	var CloudSchema = new Schema({
		provider: String,
		uid: String,
		displayName: String,
		photo: String,
		created: {type: Date, default: Date.now}
	});

	var AppSchema = new Schema({
		provider: String,
		uid: String,
		displayName: String,
		photo: String,
		created: {type: Date, default: Date.now}
	});


	var app = express();
	app.use(express.cookieParser('appZiG0s3ssi0n' ));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session());
	// Initialize Passport!  Also use passport.session() middleware, to support
	// persistent login sessions (recommended).
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);


	if(process.env.VCAP_SERVICES){ // Server
		var env = JSON.parse(process.env.VCAP_SERVICES);
		var mongo = env['mongodb-1.8'][0]['credentials'];
	}else{// Local
		var mongo = {
				"hostname":"localhost",
				"port":27017,
				"username":"",
				"password":"",
				"name":"",
				"db":"db"
		}
	}

	var generate_mongo_url = function(obj){
		obj.hostname = (obj.hostname || 'localhost');
		obj.port = (obj.port || 27017);
		obj.db = (obj.db || 'test');
		if(obj.username && obj.password){
			return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
		}
		else{
			return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
		}
	}
	var mongourl = generate_mongo_url(mongo);
	// mongoose.connect(mongourl);
	mongoose.model('Cloud', UserSchema);
	mongoose.model('App', UserSchema);



	var MongoClient = require('../node_modules/mongodb').MongoClient;
	var ObjectID = require('../node_modules/mongodb').ObjectID;
	var BSON = require('../node_modules/mongodb').BSONPure;

	var status=new Object();
	status.result=0;
	status.errorMsg='None';

	// All API calls are made via POST
	// Grab the post vars to determine the action required.

	//possible options are command,object item
	// such as [get, cloud, myCloud]

	// in genneral all calls are either inserts or gets from the DB.

	app.post('/', function(req, res){


		command = req.body.command;
		object = req.body.object;
		errors="{code : '101' , message : 'Invalid Command: Get: Valid options are Get, Do.'}";


		switch(command){

		case 'get':
			switch(object){
			case 'clouds':
				//jsonResponse=getUsercloudsJSON();
				MongoClient.connect(mongourl, function(err, db) {
					if(err){
						sendResponse(err);

					}else{

						var collection = db.collection('cloud');
						collection.find({owner : req.user._id}).toArray(function(err, clouds) {
							if(err){
								sendResponse(err);
								db.close();
							}else{


								sendResponse(clouds);
								db.close();

							}
						})

					}

				});

				break;

			case 'cloud':

				MongoClient.connect(mongourl, function(err, db) {
					if(err){
						sendResponse(err);

					}else{

						var collection = db.collection('cloud');
						collection.find({menuLabel : req.body.item}).toArray(function(err, cloud) {
							if(err || cloud.length==0){
								sendResponse(err);
								db.close();
							}else{

								var collection = db.collection('app');
								collection.find({clouds : cloud[0]._id.toHexString()}).toArray(function(err, apps) {
									if(err){
										sendResponse(err);
										db.close();
									}else{

										sendResponse({cloud : cloud, apps : apps});
										db.close();

									}
								})


							}
						})

					}

				});
				break;


			case 'apps':

				//jsonResponse=getUsercloudsJSON();
				MongoClient.connect(mongourl, function(err, db) {
					if(err){
						sendResponse(err);

					}else{

						var collection = db.collection('app');
						collection.find().toArray(function(err, apps) {
							if(err){
								sendResponse(err);
								db.close();
							}else{


								sendResponse(apps);
								db.close();

							}
						})

					}

				});


				break;


			case 'app':


				var appID= req.param('item');

				if (appID.length==24){
					var o_id = new BSON.ObjectID(req.param('item'));

					MongoClient.connect(mongourl, function(err, db) {
						if(err){
							sendResponse(err);

						}else{

							var collection = db.collection('app');
							collection.find({_id : o_id}).toArray(function(err, app) {
								if(err || app.length==0){
									sendResponse({error : 'App not found - ' + err});
									db.close();
								}else{

									var collection = db.collection('post');
									collection.find({appId : app[0]._id.toHexString()}).sort( { _id: -1 } ).toArray(function(err, posts) {
										if(err){
											sendResponse({error : 'App not found - ' + err});
											db.close();
										}else{

											var collection = db.collection('users');
											collection.find().toArray(function(err, users) {
												if(err){
													sendResponse({error : 'Users not found - ' + err});
													db.close();
												}else{


													sendResponse({app : app[0], posts : posts ,users : users});
													db.close();

												}
											})



										}
									})


								}
							})

						}

					});
				}
				break;


			case 'userNewsFeed':
				var jsonResponse = new Object();

				jsonResponse.posts= new Array();

				// jsonResponse=getUsersAppsPosts();
				sendResponse(jsonResponse);
				break;

			case 'post':

				var postId= req.param('item');

				if (postId.length==24){
					var o_id = new BSON.ObjectID(req.param('item'));

					MongoClient.connect(mongourl, function(err, db) {
						if(err){
							sendResponse(err);

						}else{

							var collection = db.collection('post');
							collection.find({_id : o_id}).toArray(function(err, post) {
								if(err || app.length==0){
									sendResponse({error : 'App not found - ' + err});
									db.close();
								}else{

									var collection = db.collection('comment');
									collection.find({postId : post[0]._id.toHexString()}).toArray(function(err, comments) {
										if(err ){
											sendResponse({error : 'Error Fetching Comments - ' + err});
											db.close();
										}else{
											var collection = db.collection('users');
											collection.find().toArray(function(err, users) {
												if(err){
													sendResponse({error : 'Users not found - ' + err});
													db.close();
												}else{


													sendResponse({posts : post , comments : comments ,users : users});
													db.close();

												}
											})




										}
									})




								}
							})

						}

					});
				}
				//jsonResponse=getSingleAppPost(postId);
				break;

			case 'snippet':
				item = req.body.item;

				switch(item){
				case 'newCloudForm':
					fs = require('fs');
					tabData = new Object();
					fs.readFile('./static/forms/newCloud.html', 'utf8', function (err,data) {
						if (err) {
							status.result = '100';
							status.errorMsg = err;
							sendResponse(jsonResponse);
						}else{
							tabData.title = "New Cloud";
							tabData.content = data;
							var jsonResponse = new Array();
							jsonResponse.push(tabData);
							sendResponse(jsonResponse);
						}

					});
					break;

				case 'newAppForm':

					fs = require('fs');
					var tabData = new Object();
					fs.readFile('./static/forms/newAppSnippet.html', 'utf8', function (err,data) {
						if (err) {
							status.result = '100';
							status.errorMsg = err;
							sendResponse(jsonResponse);
						}else{
							tabData.title = "New App";
							tabData.content = data;
							var jsonResponse = new Array();
							jsonResponse.push(tabData);
							sendResponse(jsonResponse);
						}

					});


					break;

				}
				break;


			}
			break;

		case 'do':
			switch(object){

			case 'noApps':

				fs = require('fs');
				var tabData = new Object();
				fs.readFile('./static/forms/noApps.html', 'utf8', function (err,data) {
					if (err) {
						status.result = '100';
						status.errorMsg = err;
						sendResponse(jsonResponse);
					}else{
						tabData.title = "New App";
						tabData.content = data;
						var jsonResponse = new Array();
						jsonResponse.push(tabData);
						sendResponse(jsonResponse);
					}

				});
				break;

			case 'newCloudForm':
				//form = file_get_contents('/home/bcloud/priv/forms/newCloud.php');
				//form = file_get_contents('/home/bcloud/priv/forms/newCloud.php');
				fs = require('fs');
				tabData = new Object();
				fs.readFile('./static/forms/newCloud.html', 'utf8', function (err,data) {
					if (err) {
						status.result = '100';
						status.errorMsg = err;
						sendResponse(jsonResponse);
					}else{
						tabData.title = "New Cloud";
						tabData.content = data;
						var jsonResponse = new Array();
						jsonResponse.push(tabData);
						sendResponse(jsonResponse);
					}

				});
				break;



			case 'createNewCloud':
				var name = req.body.name;
				var description = req.body.description;
				var icon = req.body.icon;
				var menuLabel = req.body.menuLabel;
				var owner = req.user._id


				MongoClient.connect(mongourl, function(err, db) {
					if(err){
						sendResponse(err);

					}else{

						var collection = db.collection('cloud');
						collection.find({menuLabel : menuLabel}).toArray(function(err, cloud) {
							if(err ){
								sendResponse(err);
								db.close();
							}else{

							if ( cloud.length!=0){
								sendResponse({cloud : cloud},'Error: This url has already been taken. Please choose another and try again.');
							}else{
								var collection = db.collection('cloud');
								collection.insert({name : name,
									description : description,
									menuLabel : menuLabel,
									icon : icon,
									owner : owner
								}, function(err, docs) {
									if(err){
										sendResponse(err);
										db.close();
									}else{

										sendResponse({docs : docs});
										db.close();

									}


								});
							}


							}
						})

					}

				});



				break;

			case 'saveApp':
				name = req.body.name;
				description  = req.body.description;
				newButtonLabel  = req.body.newButtonLabel;
				menuLabel  = req.body.menuLabel;
				icon = req.body.icon;
				feedDisplayStyle = req.body.feedDisplayStyle;
				slug = req.body.slug;
				fields = JSON.parse(req.body.fields);
				allowComments = req.body.allowComments;
				minimumPostLevel = req.body.minimumPostLevel;
				minimumViewLevel = req.body.minimumViewLevel;
				clouds = req.body.publishcloud;

				MongoClient.connect(mongourl, function(err, db) {
					if(err){
						sendResponse(err);

					}else{
						var collection = db.collection('app');
						collection.insert({name : name,
							description : description,
							menuLabel : menuLabel,
							newButtonLabel : newButtonLabel,
							feedDisplayStyle : feedDisplayStyle,
							fields : fields,
							allowComments : allowComments,
							minimumPostLevel : minimumPostLevel,
							minimumViewLevel : minimumViewLevel,
							slug : slug,
							icon : icon,
							owner : owner,
							clouds : clouds
						}, function(err, docs) {
							if(err){
								sendResponse(err);
								db.close();
							}else{

								sendResponse({'newAppID' : docs._id});
								db.close();

							}


						});
					}

				});

				//jsonResponse['newAppID']=createAppJSON(name,description,newButtonLabel,menuLabel,icon,feedDisplayStyle,slug,fields,allowComments,minimumPostLevel,minimumViewLevel,clouds);
				//jsonResponse['post']=_POST;
				//jsonResponse['clouds']= req.body.publishclouds;
				break;



				case 'comment':
				app = req.body.item;
				comment = req.body.comment;
				postId = req.body.postId;
				//	jsonResponse=createComment(app,comment,postId );



				MongoClient.connect(mongourl, function(err, db) {
					if(err){
						sendResponse(err);

					}else{
						var collection = db.collection('comment');
						collection.insert({appId : req.body.app,
							postId : req.body.postId,
							posted : new Date(),
							postedBy : {id : req.user._id , displayName : req.user.displayName, photo : req.user.photo},
							comment : req.body.comment
						}, function(err, comment) {
							if(err || comment.length==0){
								sendResponse(err);
								db.close();
							}else{

								sendResponse(comment[0]);
								db.close();

							}


						});
					}

				});


				break;
			}
			break;


		case 'post':
			switch(object){
			case 'app':

				MongoClient.connect(mongourl, function(err, db) {
					if(err){
						sendResponse(err);

					}else{
						var collection = db.collection('post');
						collection.insert({appId : req.body.appId,
							posted : new Date(),
							postedBy : {id : req.user._id , displayName : req.user.displayName, photo : req.user.photo},
							fieldData : req.body
						}, function(err, post) {
							if(err || post.length==0){
								sendResponse(err);
								db.close();
							}else{

								sendResponse({'newAppPostId' : post[0]._id});
								db.close();

							}


						});
					}

				});



				break;


			case 'appUpdate':

				var o_id = new BSON.ObjectID(req.param('postId'));

				MongoClient.connect(mongourl, function(err, db) {
					if(err){
						sendResponse(err);

					}else{
						var collection = db.collection('post');
						collection.update({_id : o_id},
								   { $set: {
							updated : new Date(),
							updatedBy : {id : req.user._id , displayName : req.user.displayName, photo : req.user.photo},
							fieldData : req.body
						}
								   }, function(err, post) {
							if(err || post.length==0){
								sendResponse(err);
								db.close();
							}else{

								sendResponse({'success' : post});
								db.close();

							}


						});
					}

				});



				break;
			}


			break;
		default: errors="{code : '100' , message : 'Invalid Command: Get: Valid options are Get, Put and Notify.'}";
		}

		function sendResponse(jsonResponse,status){
			responseData = new Object();
			responseData.response = jsonResponse;
			responseData.status = status;
			responseData.request = req.body;
			responseData.time = new Date();
			res.json(responseData);
		}
		function sendResponse2(jsonResponse){
			responseData = new Object();
			responseData.response = jsonResponse;
			responseData.status = status;
			responseData.request = req.body;
			responseData.time = 'some time later';
			res.json(responseData);
		}

	});

	return app;
}();


