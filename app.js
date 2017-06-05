const express = require('express');
//path included with node by default
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

app.get('/articles/add', function(req, res) {
    res.render('add_article', {
        title:'Add Article'
    });
});

app.post('/articles/add', function(req, res) {
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
            res.redirect('/');
        }
    });
    console.log('Submitted');
    return;
})

app.listen('8080', function() {
    console.log('Server started on p 8080 (as far as container knows)');
});