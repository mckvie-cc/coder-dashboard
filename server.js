var express = require('express'),
 signup = require('./routes/signup'),
 csv=require('./routes/csv');
var app = express();
app.use(express.static('public'));

app.get('/varifyEmail/:email/:authKey',signup.varifyEmail);
app.post('/register',signup.register);
/*app.get('/AddInitialUsers',csv.AddInitialUsers);*/
/*app.get('/addRegistered',signup.addRegistered);*/
app.get('/', function(req, res){
    res.send("Hello world!");
});

app.listen(3000);