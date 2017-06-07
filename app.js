const express = require('express');
//path included with node by default
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const messages = require('express-messages');
const connectFlash = require('connect-flash');
const expressValidator = require('express-validator');
const dbconfig = require('./config/database');
const ppconfig = require('./config/passport');
const passport = require('passport');
//import service routes
const articles = require('./routes/articles');
const users = require('./routes/users');

mongoose.connect(dbconfig.database, {
    user: dbconfig.mongodbUser,
    pass: dbconfig.mongodbPass
});
var db = mongoose.connection;

//check connection
db.once('open', function() {
    console.log('Connected to MongoDB');
});

//check for db errors
db.on('error', function(err) {
    console.log(err);
});

//Init app
const app = express();

//Bring in models
var Article = require('./models/article');

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Set public folder to serve static files
app.use(express.static(path.join(__dirname, 'public')));

//express-session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true }//removed to allow the flash functionality
}));

//express-messages middleware
app.use(connectFlash());
app.use(function (req, res, next) {
    res.locals.messages = messages(req, res);
    next();
});

//express-validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));

//Passport config
ppconfig(passport);
app.use(passport.initialize());
app.use(passport.session());

//Global user variable setup via custom middleware
app.get('*', function(req, res, next) {
    res.locals.user = req.user || null;
    next();
});

//Home route
app.get('/', function(req, res) {
    //read from Article table with empty search params
    Article.find({}, function(err, articles) {
        if (err) {
            console.log(err)
        } else {
            res.render('index', {
                title:'Hello',
                articles:articles
            });
        }
    });
});

app.get('/pagecount', function(req, res) {
    res.send('1');
});

app.use('/articles', articles);
app.use('/users', users);

app.listen('8080', function() {
    console.log('Server started on p 8080 (as far as container knows)');
});
/* notes: we've also done:
 apt-get install nodejs
 apt-get install git
 apt-get install npm
    npm install --save express
    npm install --save pug
    npm install --save mongoose
    npm install --save body-parser
    npm install -g nodemon
    npm install -g bower
        bower install bootstrap --allow-root
    npm install --save
        express-messages
        express-session
        connect-flash
        express-validator

*/