var csv = require('csv-parser')
var fs = require('fs');
var mongo = require('mongodb');
var Server = mongo.Server
var Db = mongo.Db
var BSON = mongo.BSONPure;
var objectId=mongo.ObjectId;
var MongoClient = mongo.MongoClient;
var database_url="mongodb://admin:joysa000@ds023634.mlab.com:23634/coder_dashboard";

exports.AddInitialUsers=function(req,res){ 
 fs.createReadStream('Initial_Assessment_Quiz.csv')
  .pipe(csv())
  .on('data', function (data) {
  	var email=data.Username;
  var authKey=Math.random().toString(36).substring(7);
   MongoClient.connect(database_url,function(err, db) {
     console.log("Connected successfully to server");
     db.collection('signups', function(err, collection) {
        if(err){
          res.send({status:0});
          console.log(err);
        }
        else{
          collection.insert({email:email,authKey:authKey},function(err, result) {
            if(err){
            	console.log(err);
            }
            else{
            	//console.log("no error"+result);
            }
          }); 
        }
      });
    //console.log(req.params);
      db.close();
  });
    //console.log(email+" "+authKey);
  })
 	res.send("Done");

 }
