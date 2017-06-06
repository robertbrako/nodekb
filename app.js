const express = require('express');
//path included with node by default
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const messages = require('express-messages');
const connectFlash = require('connect-flash');
const expressValidator = require('express-validator');

//setup db
mongoose.connect('mongodb://192.168.1.190:27024/nodekb');
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

//Get single article
app.get('/article/:id', function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        res.render('article', {
            article:article
        });
    });
});

app.get('/articles/add', function(req, res) {
    res.render('add_article', {
        title:'Add Article'
    });
});

app.post('/articles/add', function(req, res) {
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    //Get Errors
    var errors = req.validationErrors();
    if (errors) {
        res.render('add_article', {
            title:'Add Article',
            errors:errors
        });
        return;
    }

    var article = new Article();
    //time for another dependency (body-parser)
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    //insert to db
    article.save(function(err) {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Article Added');
            res.redirect('/');
        }
    });
    console.log('Submitted');
    return;
});

//Edit existing article
app.get('/article/edit/:id', function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        res.render('edit_article', {
            title:'Edit Article',
            article:article
        });
    });
});

//Update Submit POST Route
app.post('/articles/edit/:id', function(req, res) {
    var article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    //update db: notice Article.update instead of article.save
    var query = {_id:req.params.id};
    Article.update(query, article, function(err) {
        if (err) {
            console.log(err);
            res.end('500');
            return;
        } else {
            req.flash('success', 'Article Updated');
            res.redirect('/');
        }
    });
    console.log('Submitted');
    return;
});

//Delete
app.delete('/article/:id', function(req, res) {
    var query = {_id:req.params.id};
    Article.remove(query, function(err) {
        if (err) {
            console.log(err);
        }
        res.send('Success');
    })
});

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
        expressvalidator

*/