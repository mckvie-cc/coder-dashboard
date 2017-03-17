var express = require('express')
var router = express.Router()
var mongo = require('mongodb');
var objectId=mongo.ObjectId;
var MongoClient = mongo.MongoClient;
var database_url="mongodb://admin:joysa000@ds023634.mlab.com:23634/coder_dashboard";

var fs = require('fs');

function readJSONFile(filename, callback) {
  fs.readFile(filename, function (err, data) {
    if(err) {
      callback(err);
      return;
    }
    try {
      callback(null, JSON.parse(data));
    } catch(exception) {
      callback(exception);
    }
  });
}


router.get('/userRatings', (req, res) => {
	readJSONFile('commit_data.json', function (err, json) {
	  if(err) { throw err; }
	  let json_data=json;
	  getUserLists(function(users){
	  	let user_list=users;
	  	var profile_list=user_list.map((user)=>{
	  		const profile_user_name=(user.profile_url).replace("https://github.com/","");
	  		const commit_count=(json_data.filter((commit)=>commit.author.login===profile_user_name.trim())).length;
	  		user.commit_count=commit_count;
	  		return user;
	  	}).sort((a,b)=>a.commit_count<b.commit_count);
	  	console.log(profile_list);
	  	res.send(json);
	  });
	})
});

function getUserLists(callback){
   MongoClient.connect(database_url,function(err, db) {
      db.collection('users', function(err, collection) {
        if(err){
            return;
        }
        else {
          collection.find({}).toArray(function(err, items) {
              callback(items);
          });
        }
      });
       db.close();
    });
}
module.exports = router