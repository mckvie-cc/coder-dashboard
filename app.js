const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const path = require('path')
const morgan = require('morgan');
const config = require('./config/config')
const port = process.env.PORT || 3000
const mongo = require('mongodb');
const objectId = mongo.ObjectId;
const MongoClient = mongo.MongoClient;
const dbURL = config.production.database
var DBObj
app.use(session({
    secret: 'randomsecret',
    store: new MongoStore({ url: dbURL }),
    saveUninitialized: false,
    resave: false
}));
MongoClient.connect(dbURL, (err, db) => {
    if (err) {
        console.log('DB could not be connected\n', err.message)
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
app.use(morgan('dev'));

const web_pages = require('./routes/web_pages')
const users = require('./routes/accounts')
const apis = require('./routes/apis')

//This middleware enables the db variable to be used in all routes
app.use(function(req, res, next) {
    req.objectId = objectId
    req.db = DBObj;
    next();
});
app.use('/', web_pages)
app.use('/users', users)
app.use('/apis', apis)
