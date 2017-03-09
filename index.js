const express = require('express')
const path = require('path')
const signup = require('./routes/signup')
const csv=require('./routes/csv')
const app = express();
const bodyParser = require('body-parser')
const port = 3000
app.listen(port, function(){
	console.log(`App listening on port: ${port}`)
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
})); 


const routes = require('./routes/web_pages')
const users = require('./routes/accounts')
app.use('/', routes)
app.use('/users', users)

// app.get('/varifyEmail/:email/:authKey',signup.varifyEmail);
// app.get('/getUsers',signup.getUsers);
// app.post('/register',signup.register);
// app.get('/sendMails',signup.sendMails);
/*app.get('/AddInitialUsers',csv.AddInitialUsers);*/
/*app.get('/addRegistered',signup.addRegistered);*/

