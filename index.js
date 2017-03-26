const express = require('express')
const path = require('path')
const app = express();
const bodyParser = require('body-parser')
const port = 3000
const MongoClient = require('mongodb').MongoClient
const dbURL = "mongodb://admin:joysa000@ds023634.mlab.com:23634/coder_dashboard"
var DBObj
MongoClient.connect(dbURL, (err, db) => {
    if (err) {
    	console.log('DB could not be connected\n',err.message)
        return
    }
    DBObj = db
    app.listen(port, function() {
        console.log(`App listening on port: ${port}`)
    });
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const web_pages = require('./routes/web_pages')
const users = require('./routes/accounts')
const api = require('./routes/apis')

//This middleware enables the db variable to be used in all routes
app.use(function(req, res, next) {
    req.db = DBObj;
    next();
});
app.use('/', web_pages)
app.use('/users', users)
app.use('/api', api)