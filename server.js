var express = require('express'),
 signup = require('./routes/signup'),
 csv=require('./routes/csv');
var app = express();
app.use(express.static('public'));
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.get('/varifyEmail/:email/:authKey',signup.varifyEmail);
app.get('/getUsers',signup.getUsers);
app.post('/register',signup.register);
/*app.get('/AddInitialUsers',csv.AddInitialUsers);*/
/*app.get('/addRegistered',signup.addRegistered);*/
app.get('/', function(req, res){
    res.send("Hello world!");
});

app.listen(3000);